import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import LoadingIndicator from '../components/LoadingIndicator'
import { fetchAllUsersData, fetchOrderData, fetchOrderProductData, fetchProductData } from '../utils/dataFetchutils'
import '../styles/OrderDetail.css'
import api from '../api'

function OrderDetail() {
    const {orderId} = useParams()
    const {role} = useParams()
    const [orderProducts, setOrderProducts] = useState([])
    const [products, setProducts] = useState([])
    const [order, setOrder] = useState(null)
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [Completed, setCompleted] = useState(false)
    const navigate = useNavigate()

    const directHome = () => {
        navigate('/')
    }

    const directUpdate = () => {
        navigate('/orderupdate/' + orderId)
    }

    const getAllData = async () => {
        try{
            const orderData = await fetchOrderData()
            const orderProductData = await fetchOrderProductData()
            const productData = await fetchProductData()

            const filteredOrderData = orderData.filter(order => order.id === parseInt(orderId))
            const filteredOrderProductData = orderProductData.filter(orderProduct => orderProduct.order === parseInt(orderId))
            const filteredProductData = productData.filter(product =>
                filteredOrderProductData.some(orderProduct => orderProduct.product === product.id)
            )

            if(filteredOrderData && filteredOrderProductData && filteredProductData){
                setOrder(filteredOrderData[0])
                setOrderProducts(filteredOrderProductData)
                setProducts(filteredProductData)
            }
            

            if(role === 'manager') {
                const usersData = await fetchAllUsersData()
                const filteredUsersData = usersData.filter(user => user.id === filteredOrderData[0].user)
                setUser(filteredUsersData[0])
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const markComplete = async () => {
        const res = api.put('/api/order/update/' + orderId + '/', {isCompleted: true})
        setCompleted(true)
    }

    useEffect(() => {
        getAllData()
    }, [])

    if(loading) {
        return <div className='orderListDiv'><LoadingIndicator /></div>
    }

    if(Completed) {
        return <div className='orderCreateDiv'>
            <div className="success">
            <div className="success__icon">
                <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path clipRule="evenodd" d="m12 1c-6.075 0-11 4.925-11 11s4.925 11 11 11 11-4.925 11-11-4.925-11-11-11zm4.768 9.14c.0878-.1004.1546-.21726.1966-.34383.0419-.12657.0581-.26026.0477-.39319-.0105-.13293-.0475-.26242-.1087-.38085-.0613-.11844-.1456-.22342-.2481-.30879-.1024-.08536-.2209-.14938-.3484-.18828s-.2616-.0519-.3942-.03823c-.1327.01366-.2612.05372-.3782.1178-.1169.06409-.2198.15091-.3027.25537l-4.3 5.159-2.225-2.226c-.1886-.1822-.4412-.283-.7034-.2807s-.51301.1075-.69842.2929-.29058.4362-.29285.6984c-.00228.2622.09851.5148.28067.7034l3 3c.0983.0982.2159.1748.3454.2251.1295.0502.2681.0729.4069.0665.1387-.0063.2747-.0414.3991-.1032.1244-.0617.2347-.1487.3236-.2554z" fill="#393a37" fillRule="evenodd"></path></svg>
            </div>
            <div className="success__title">Successfully Marked as Complete!<br/>성공적으로 완료 처리가 되었습니다!</div>
            </div>
            <button onClick={() => directHome()} className="btn">Home 홈페이지</button>
        </div>
    }

    return <div className='orderListDiv'>
        <div className="card">
            {role === 'manager' && <div className="card__title">
                <div id='title' className="card__right__detail">
                Location<br/>지점
                </div>
                <div id='title' className="card__right__detail">
                Name 이름
                </div>
                <div id='title' className="card__left__detail">
                Date 날짜
                </div>
            </div>}
            {role === 'worker' && <div className="card__title">
                <div id='title' className="card__right__worker__detail">
                Location<br/>지점
                </div>
                <div id='title' className="card__left__worker__detail">
                Date 날짜
                </div>
            </div>}
            {role === 'manager' && <div className="card__data">
                <div className="card__right__detail">
                    <div className='item'>
                        {order.location}
                    </div>
                </div>
                <div className="card__right__detail">
                    <div className='item'>
                        {user.username}
                    </div>
                </div>
                <div className="card__left__detail">
                    <div className='item'>
                        {order.date}
                    </div>
                </div>
            </div>}
            {role === 'worker' && <div className="card__data">
                <div className="card__right__worker__detail">
                    <div className='item'>
                        {order.location}
                    </div>
                </div>
                <div className="card__left__worker__detail">
                    <div className='item'>
                        {order.date}
                    </div>
                </div>
            </div>}
        </div>
        <div id='productList' className="card">
            <div className="card__title">
                <div id='title' className="card__right__worker__detail">
                    Product<br/>물품
                </div>
                <div id='title' className="card__left__worker__detail">
                    Quantity 갯수
                </div>
            </div>
            <div className="card__data">
                <div className="card__right__worker__detail">
                    {products.map(product => (
                        <div key={product.id} className='item'>
                            {product.productName}
                        </div>
                    ))}
                    {order.additionalMessage && <div id='AM' className='item'>
                        Additional Message 추가 메시지
                    </div>}
                </div>
                <div className="card__left__worker__detail">
                    {products.map(product => (
                        <div key={product.id} className='item'>
                            {orderProducts[orderProducts.findIndex(orderProduct => orderProduct.product === product.id)].numProduct}
                        </div>
                    ))}
                    {order.additionalMessage && <div className='item'>
                        {order.additionalMessage}
                    </div>}
                </div>
            </div>
        </div>
        {(role === 'manager' && !order.isCompleted)&&
        <button onClick={() => markComplete()} className="btn">Mark as Completed 완료 처리</button>}
        {(role === 'worker' && !order.isCompleted)&&
        <button onClick={() => directUpdate()} className="btn">Update 수정</button>}
        <button onClick={() => directHome()} className="btn">Home 홈페이지</button>
    </div>
}

export default OrderDetail