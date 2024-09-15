import { useEffect, useState } from 'react'
import { fetchUserData, fetchOrderData, fetchOrderProductData,fetchProductData } from '../utils/dataFetchutils'
import ZenLogo from '../assets/ZenRamen_Logo1024_1.jpg'
import LoadingIndicator from '../components/LoadingIndicator'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import { getToken } from 'firebase/messaging'
import { messaging } from '../firebase'

function Home() {
    const [user, setUser] = useState(null)
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()
    
    const getAllData = async () => {
        try {
          // To be used offline
          fetchProductData()
          fetchOrderProductData()

          const userData = await fetchUserData()
          const FCMToken = ''

          if (userData) {
            setUser(userData[0])
            const tokenData = await api.get('/api/get-token/')
            if(Notification.permission === 'granted'){
              FCMToken = await getToken(messaging, {
                vapidKey: import.meta.env.VITE_VAPID_KEY
              })
            }
            
            if(tokenData.data && Notification.permission === 'granted'){
              const filteredToken = tokenData.data.filter(data => data.token === FCMToken)
              if(!filteredToken[0]){
                const tokenPost = await api.post('/api/save-token/', {token:FCMToken})
              }
            }
          }

          if(userData[0].username !== 'Jamie' || userData[0].username !== 'Scott'){
            const orderData = await fetchOrderData()
            if(orderData) {
              const filteredOrder = orderData.filter(order => order.isCompleted === false)
              setOrder(filteredOrder[0])
            }
          }
        } catch (error) {
          console.error(error)
        } finally {
          setLoading(false)
        }
    }

      const handleClick = (route) => {
        if (route === 'ManagerPendingOrder' ){
            navigate('/managerorderlist')
        } else if (route === 'ManagerCompletedOrder') {
            navigate('/managercompletedorders')
        } else if (route === 'CreateOrder') {
          navigate('/ordercreate')
        } else if (route === 'WorkerPendingOrder') {
          navigate('/order/' + order.id + '/worker')
        } else if (route === 'WorkerCompletedOrder') {
          navigate('/workercompletedorders')
        }
    }

    useEffect(() => {
        getAllData()
      }, []);

    if(loading) {
      return <div className='initialDiv'><LoadingIndicator /></div>
    }

    if(user.username === 'Jamie' || user.username === 'Scott'){
          return <div className='initialDiv'>
              <img src={ZenLogo} alt='Logo' width={200} height={100}/>
              <button onClick={() => handleClick('ManagerPendingOrder')} className="btn">Pending Order List 미완료 주문 목록</button>
              <button onClick={() => handleClick('ManagerCompletedOrder')} className="btn">Completed Order List 완료 주문 목록</button>
          </div>
    }

    return <div className='initialDiv'>
      <img src={ZenLogo} alt='Logo' width={200} height={100}/>
      <button onClick={() => handleClick('CreateOrder')} className="btn">Create New Order 새 주문 추가</button>
      {order && <button onClick={() => handleClick('WorkerPendingOrder')} className="btn">Pending Order 미완료 주문</button>}
      <button onClick={() => handleClick('WorkerCompletedOrder')} className="btn">Completed Order List 완료 주문 목록</button>
    </div>
}

export default Home