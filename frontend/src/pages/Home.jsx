import { useEffect, useState } from 'react'
import { fetchUserData } from '../utils/dataFetchutils'
import ZenLogo from '../assets/ZenRamen_Logo1024_1.jpg'
import LoadingIndicator from '../components/LoadingIndicator'
import { useNavigate } from 'react-router-dom'

function Home() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    
    const getUserData = async () => {
        try {
          const data = await fetchUserData()
          if (data) {
            setUser(data[0])
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
          navigate('/workerorderlist')
        } else if (route === 'WorkerCompletedOrder') {
          navigate('/workercompletedorders')
        }
    }

    useEffect(() => {
        getUserData()
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
      <button onClick={() => handleClick('WorkerPendingOrder')} className="btn">Pending Order 미완료 주문</button>
      <button onClick={() => handleClick('WorkerCompletedOrder')} className="btn">Completed Order List 완료 주문 목록</button>
    </div>
}

export default Home