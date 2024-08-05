import { useState, useEffect } from 'react'
import '../styles/OrderList.css'
import { fetchOrderData, fetchAllUsersData } from '../utils/dataFetchutils'
import LoadingIndicator from '../components/LoadingIndicator'
import { useNavigate } from 'react-router-dom'

function OrderList({page, role}) {
    const [orders, setOrders] = useState([])
    const [users, setUsers] = useState([])
    const [selectedLocation, setSelectedLocation] = useState('')
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const title1 = page === 'pendingOrderList' ? 'Pending Orders' : 'Completed Order'
    const title2 = page === 'pendingOrderList' ? '미완료 주문' : '완료 주문'

    const directDetails = (orderId) => {
        navigate('/order/' + orderId + '/' + role)
    }

    const getOrderAndUserData = async () => {
        try {
          const orderData = await fetchOrderData()
          if (orderData) {
            if(page !== 'pendingOrderList') {
                if(selectedLocation === '' || selectedLocation === 'All') {
                    const filtered = orderData.filter(order => order.isCompleted === true)
                    setOrders(filtered)
                } else if (selectedLocation !== '') {
                    const filtered = orderData.filter(order => order.isCompleted === true && order.location === selectedLocation)
                    setOrders(filtered)
                }
            } else {
                if(selectedLocation === '' || selectedLocation === 'All') {
                    const filtered = orderData.filter(order => order.isCompleted === false)
                    setOrders(filtered)
                } else if (selectedLocation !== '') {
                    const filtered = orderData.filter(order => order.isCompleted === false && order.location === selectedLocation)
                    setOrders(filtered)
                }
            }
            if(role === 'manager') {
                const usersData = await fetchAllUsersData()
                setUsers(usersData)
            }
          }
        } catch (error) {
          console.error(error)
        } finally {
          setLoading(false)
        }
    }

    const directHome = () => {
        navigate('/')
    }

    useEffect(() => {
        getOrderAndUserData()    
    }, [selectedLocation])

    if(loading) {
        return <div className='orderListDiv'><LoadingIndicator /></div>
    }

    return <div className='orderListDiv'>
        <h1 className='titleH1'>{title1}</h1>
        <h1 className='titleH1'>{title2}</h1>
        <div id='listBox' className='login-box'>
            {role === 'manager' && <div className='user-box' id='orderCreateBox'>
                <select defaultValue='All' onChange={(e) => setSelectedLocation(e.target.value)} name="location" id="location">
                    <option value='All'>All</option>
                    <option value="Parkland">Parkland</option>
                    <option value="Lakewood">Lakewood</option>
                    <option value="Downtown Tacoma">Downtown Tacoma</option>
                    <option value="Olympia">Olympia</option>
                    <option value="Tumwater">Tumwater</option>
                    <option value="University Place">University Place</option>
                    <option value="Shelton">Shelton</option>
                </select>
                <label>Location 지점</label>
            </div>}
        </div>
        <div className="card">
            {role === 'manager' && <div className="card__title">
                <div id='title' className="card__right">
                Location<br/>지점
                </div>
                <div id='title' className="card__right">
                Name 이름
                </div>
                <div id='title' className="card__right">
                Date 날짜
                </div>
                <div className="card__left">
                </div>
            </div>}
            {role === 'worker' && <div className="card__title">
                <div id='title' className="card__right__worker">
                Location<br/>지점
                </div>
                <div id='title' className="card__right__worker">
                Date 날짜
                </div>
                <div className="card__left__worker">
                </div>
            </div>}
            {role === 'manager' && <div className="card__data">
                <div className="card__right">
                    {orders.map(order => (
                        <div key={order.id} className='item'>
                            {order.location}
                        </div>
                    ))}
                </div>
                <div className="card__right">
                    {orders.map(order => (
                        <div key={order.id} className='item'>
                            {users[users.findIndex(user => user.id === order.user)].username}
                        </div>
                    ))}
                </div>
                <div className="card__right">
                    {orders.map(order => (
                        <div key={order.id} className='item'>
                            {order.date}
                        </div>
                    ))}
                </div>
                <div className="card__left">
                    {orders.map(order => (
                        <div key={order.id} className='item'>
                            <button onClick={() => directDetails(order.id)} id='listBtn' className='btn'>Detail 디테일</button>
                        </div>
                    ))}
                </div>
            </div>}
            {role === 'worker' && <div className="card__data">
                <div className="card__right__worker">
                    {orders.map(order => (
                        <div key={order.id} className='item'>
                            {order.location}
                        </div>
                    ))}
                </div>
                <div className="card__right__worker">
                    {orders.map(order => (
                        <div key={order.id} className='item'>
                            {order.date}
                        </div>
                    ))}
                </div>
                <div className="card__left__worker">
                    {orders.map(order => (
                        <div key={order.id} className='item'>
                            <button onClick={() => directDetails(order.id)} id='listBtn' className='btn'>Detail 디테일</button>
                        </div>
                    ))}
                </div>
            </div>}
        </div>
        <button onClick={() => directHome()} className="btn">Home 홈페이지</button>
    </div>
}

export default OrderList