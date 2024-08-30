import { fetchOrderProductData, fetchProductData, fetchOrderData } from '../utils/dataFetchutils'
import { useEffect, useState } from 'react'
import LoadingIndicator from '../components/LoadingIndicator'
import '../styles/OrderForm.css'
import api from '../api'
import { useNavigate, useParams } from 'react-router-dom'

function OrderForm({method, route}) {
    const [products, setProducts] = useState([])
    const [additionalMessage, setAddtionalMessage] = useState('')
    const [location, setLocation] = useState('')
    const [orderProducts, setOrderProduct] = useState([])
    const [loading, setLoading] = useState(true)
    const [Completed, setCompleted] = useState(false)
    const [orders, setOrders] = useState([])
    const navigate = useNavigate()
    const {orderId} = useParams()
    const englishTitle = method === 'update' ? 'Order Update' : 'New Order'
    const koreanTitle = method === 'update' ? '주문 수정' : '새 주문'
    const englishSubmit = method === 'update' ? 'Update Order' : 'Create Order'
    const koreanSubmit = method === 'update' ? '주문 수정' : '주문 생성'
    const englishSuccess = method === 'update' ? 'Successfully Updated!' : 'Successfully Created!'
    const koreanSuccess = method === 'update' ? '성공적으로 수정하였습니다!' : '성공적으로 생성하였습니다!'

    const getAllNecessaryData = async () => {
        try {
          const productData = await fetchProductData()
          const orderData = await fetchOrderData()
          if (productData && orderData) {
            setProducts(productData)
            setOrders(orderData)
          }
          if(method === 'update') {
            const orderProductData = await fetchOrderProductData()
            const filteredOP = orderProductData.filter(orderProduct => orderProduct.order === parseInt(orderId))
            const filteredOrder = orderData.filter(order => order.id === parseInt(orderId))
            if(filteredOP && filteredOrder) {
              setOrderProduct(filteredOP)
              if(filteredOrder[0].additionalMessage){
                setAddtionalMessage(filteredOrder[0].additionalMessage)
              }              
              setLocation(filteredOrder[0].location)
            }
          }
        } catch (error) {
          console.error(error)
        } finally {
          setLoading(false)
        }
      }
    
    const handleProductChange = (e) => {
      const productId = e.target.name;
      const numProduct = parseInt(e.target.value)

      setOrderProduct(prev => {
        const updated = [...prev]
        const index = updated.findIndex(item => item.product === productId)
        if (index > -1) {
          updated[index].numProduct = numProduct
        } else {
          updated.push({product:productId, numProduct})
        }
        return updated
      })
    }

    const directHome = () => {
      navigate('/')
    }

    const handleSubmit = async (e) => {
      setLoading(true)
      e.preventDefault()
      const orderData = {
        additionalMessage: additionalMessage,
        location: location,
        products: orderProducts
      }

      try {
        if(method === 'create'){
          const res = await api.post(route, orderData)
        } else {
          const res = await api.put(route + orderId + '/', orderData)
        }
        setCompleted(true)
      } catch(error) {
        console.log(error)
        const pendingOrder = orders.filter(order => order.isCompleted === false)
        if(method === 'create' && pendingOrder[0]){
          alert('Only One Pending Order is Allowed Per User. Try Updating the Order.\n유저당 한개만의 미완료 주문이 허용됩니다. 현재 완료되지 않은 주문 수정을 해보십시요.')
        } else if (method === 'update') {
          alert('Order Already Has Been Completed. Try Creating New Order.\n주문이 이미 완료 되었습니다. 새로운 주문을 요청해주세요.')
        }
        if(!navigator.onLine){
          if(method === 'update'){
            setCompleted(true)
          } else{
            if(!pendingOrder[0]){
              setCompleted(true)
            }
          }
        }
      } finally {
        setLoading(false)
      }
    }

    useEffect(() => {
        getAllNecessaryData()    
      }, [])

    if(loading) {
        return <div className='orderCreateDiv'><LoadingIndicator /></div>
    }

    if(Completed) {
      return <div className='orderCreateDiv'>
        <div className="success">
          <div className="success__icon">
            <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path clipRule="evenodd" d="m12 1c-6.075 0-11 4.925-11 11s4.925 11 11 11 11-4.925 11-11-4.925-11-11-11zm4.768 9.14c.0878-.1004.1546-.21726.1966-.34383.0419-.12657.0581-.26026.0477-.39319-.0105-.13293-.0475-.26242-.1087-.38085-.0613-.11844-.1456-.22342-.2481-.30879-.1024-.08536-.2209-.14938-.3484-.18828s-.2616-.0519-.3942-.03823c-.1327.01366-.2612.05372-.3782.1178-.1169.06409-.2198.15091-.3027.25537l-4.3 5.159-2.225-2.226c-.1886-.1822-.4412-.283-.7034-.2807s-.51301.1075-.69842.2929-.29058.4362-.29285.6984c-.00228.2622.09851.5148.28067.7034l3 3c.0983.0982.2159.1748.3454.2251.1295.0502.2681.0729.4069.0665.1387-.0063.2747-.0414.3991-.1032.1244-.0617.2347-.1487.3236-.2554z" fill="#393a37" fillRule="evenodd"></path></svg>
          </div>
          {navigator.onLine && <div className="success__title">{englishSuccess}<br/>{koreanSuccess}</div>}
          {!navigator.onLine && <div className="success__title">Your Network Seems Offline. Request Will be Handled When It is Back Online.
            <br/>사용자의 네트워크가 연결되있지 않습니다. 요청은 네트워크가 연결되면 처리 될것입니다.</div>}
        </div>
        <button onClick={() => directHome()} className="btn">Home 홈페이지</button>
      </div>
    }

    return <div className='orderCreateDiv'>
        <div className='login-box'>
            <form onSubmit={handleSubmit}>
                <h1>{englishTitle}<br/>{koreanTitle}</h1>
                <ul className='productList'>
                {products.map(product => (
                    <li key={product.id}>
                    <div className='user-box' id='orderCreateBox'>
                    <input 
                        type='number'
                        name={product.id}
                        onChange={handleProductChange}
                        defaultValue={(method === 'update' && orderProducts[orderProducts.findIndex(
                          orderProduct => orderProduct.product === product.id)]) && orderProducts[orderProducts.findIndex(
                          orderProduct => orderProduct.product === product.id)].numProduct}
                    />
                    <label>{product.productName}</label>
                    </div>
                    </li>
                ))}
                </ul>
                <div className='user-box' id='orderCreateBox'>
                    <input 
                        type='text'
                        onChange={(e) => setAddtionalMessage(e.target.value)}
                        defaultValue={additionalMessage && additionalMessage}
                    />
                    <label>Additional Message 추가 메시지</label>
                </div>
                <div className='user-box' id='orderCreateBox'>
                    <select defaultValue='' value={location && location} onChange={(e) => setLocation(e.target.value)} name="location" id="location">
                        <option value=''>Field Required 입력 필수</option>
                        <option value="Parkland">Parkland</option>
                        <option value="Lakewood">Lakewood</option>
                        <option value="Downtown Tacoma">Downtown Tacoma</option>
                        <option value="Olympia">Olympia</option>
                        <option value="Tumwater">Tumwater</option>
                        <option value="University Place">University Place</option>
                        <option value="Shelton">Shelton</option>
                    </select>
                    <label>Location 지점</label>
                </div>
                {loading && <LoadingIndicator />}
                <center>
                    <button className='formButton' type='submit'>
                            {englishSubmit}<br/>{koreanSubmit}
                    </button>
                </center>
            </form>
            <button onClick={() => directHome()} className="btn">Home 홈페이지</button>
        </div>
    </div>
}

export default OrderForm