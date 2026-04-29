import { fetchProductData, fetchUserRoleData } from '../utils/dataFetchutils'
import { useEffect, useState } from 'react'
import LoadingIndicator from '../components/LoadingIndicator'
import '../styles/OrderForm.css'
import api from '../api'
import { useNavigate, useParams } from 'react-router-dom'
import NotFound from './NotFound'

function ProductUpdate() {
    const [productName, setProductName] = useState(null)
    const [price, setPrice] = useState(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const {productId} = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [Completed, setCompleted] = useState(false)

    
    const directHome = () => {
      navigate('/')
    }

    const fetchRole = async () => {
        try{
            const userRole = await fetchUserRoleData()

            if(userRole[0].role == 'Master' || userRole[0].role == 'Admin') {
                setIsAdmin(true)
            }
        } catch (error) {
          console.error(error)
        }
    }

    const fetchProduct = async () => {
        try{
            const products = await fetchProductData()
            const filteredProduct = products.filter(product => product.id == parseInt(productId))
            setProductName(filteredProduct[0].productName)
            setPrice(filteredProduct[0].price)
        } catch (error) {
            console.error(error)
        }
    }

    const handleSubmit = async (e) => {
      setLoading(true)
      e.preventDefault()
      const productData = {
        productName: productName,
        price: price
      }
      try {
        const res = await api.put('api/product/update/' + productId + '/', productData)
        setCompleted(true)
      } catch(error) {
        console.log(error)
        if (navigator.onLine){
          alert('Error Occured. Contact Administrator.\n오류가 발생했습니다. 관리자에게 문의 해주세요.')
        }
        else if(!navigator.onLine) {
          setCompleted(true)
        }
      } finally {
        setLoading(false)
      }
    }

    useEffect(() => {
        fetchRole()
        fetchProduct()
        setLoading(false)
      }, [])

    if(loading) {
        return <div className='orderCreateDiv'><LoadingIndicator /></div>
    }

    if(isAdmin == false) {
        return <div><NotFound /></div>
    }

    if(Completed) {
      return <div className='orderCreateDiv'>
        <div className="success">
          <div className="success__icon">
            <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path clipRule="evenodd" d="m12 1c-6.075 0-11 4.925-11 11s4.925 11 11 11 11-4.925 11-11-4.925-11-11-11zm4.768 9.14c.0878-.1004.1546-.21726.1966-.34383.0419-.12657.0581-.26026.0477-.39319-.0105-.13293-.0475-.26242-.1087-.38085-.0613-.11844-.1456-.22342-.2481-.30879-.1024-.08536-.2209-.14938-.3484-.18828s-.2616-.0519-.3942-.03823c-.1327.01366-.2612.05372-.3782.1178-.1169.06409-.2198.15091-.3027.25537l-4.3 5.159-2.225-2.226c-.1886-.1822-.4412-.283-.7034-.2807s-.51301.1075-.69842.2929-.29058.4362-.29285.6984c-.00228.2622.09851.5148.28067.7034l3 3c.0983.0982.2159.1748.3454.2251.1295.0502.2681.0729.4069.0665.1387-.0063.2747-.0414.3991-.1032.1244-.0617.2347-.1487.3236-.2554z" fill="#393a37" fillRule="evenodd"></path></svg>
          </div>
          {navigator.onLine && <div className="success__title">성공적으로 수정하셨습니다!<br/>Successfully Updated!</div>}
          {!navigator.onLine && <div className="success__title">Your Network Seems Offline. Request Will be Handled When It is Back Online.
            <br/>사용자의 네트워크가 연결되있지 않습니다. 요청은 네트워크가 연결되면 처리 될것입니다.</div>}
        </div>
        <button onClick={() => directHome()} className="btn">Home 홈페이지</button>
      </div>
    }

    return <div className='orderCreateDiv'>
        <div className='login-box'>
            <form onSubmit={handleSubmit}>
                <h1>Product Update<br/>품목 수정</h1>
                <div className='user-box' id='orderCreateBox'>
                    <input 
                        type= 'text'
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                    />
                    <label>Product Name 품목 이름</label>
                </div>
                <div className='user-box' id='orderCreateBox'>
                    <input 
                        type= 'number'
                        value={price}
                        inputMode='decimal'
                        onChange={(e) => {
                            let val = e.target.value

                            if (!/^\d*\.?\d*$/.test(val)) return

                            if (val.includes(".")) {
                            const [int, dec] = val.split(".")
                            if (dec.length > 2) return
                            }

                            setPrice(val)
                        }}
                        onBlur={() => {
                            if (price) {
                            setPrice(parseFloat(price).toFixed(2))
                            }
                        }}
                        required
                    />
                    <label>Product Price 품목 가격</label>
                </div>
                {loading && <LoadingIndicator />}
                <center>
                    <button className='formButton' type='submit'>
                            수정<br/>Update
                    </button>
                </center>
            </form>
            <button onClick={() => directHome()} className="btn">Home 홈페이지</button>
        </div>
    </div>
}

export default ProductUpdate