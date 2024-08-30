import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import { useEffect } from 'react'
import './styles/Render.css'
import Login from './pages/Login'
import Home from './pages/Home'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import Initial from './pages/Initial'
import LoginStatus from './components/LoginStatus'
import Footer from './components/Footer'
import ManagerCompletedOrder from './pages/ManagerCompletedOrders'
import ManagerOrderList from './pages/ManagerOrderList'
import OrderCreate from './pages/OrderCreate'
import WorkerCompletedOrders from './pages/WorkerCompletedOrders'
import OrderDetail from './pages/OrderDetail'
import OrderUpdate from './pages/OrderUpdate'
import { onMessage } from 'firebase/messaging'
import { messaging } from './firebase'
import toast, { Toaster } from 'react-hot-toast'

function Logout() {
  localStorage.clear()
  return <Navigate to ='/initial' />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

const isIOS = /iPad|iPhone|iPod|Mac/.test(navigator.userAgent)
const isStandAlone = window.navigator.standalone === true

const notificationCheck = () => {
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification Permission Granted.')
    } else if(permission === 'denied') {
      alert('You denied for the notification')
    }
  })
}

function App() {
  useEffect (() => {
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload)
      toast.success(payload.data.body)
    })
    if(!isIOS) {
      notificationCheck()
    } else if (isIOS && isStandAlone) {
      alert('Welcome! If You Haven\'t Allowed Notification Please Do So by Going to Settings > Zen Inventory > Notification > Allow Notification\n' +
            'If You Have Done So, Please Disregard This Message.\n' +
            'First Time User Will be Asked To Allow Notification When Logging in\n' +
            '환영합니다! 아직 알림 설정을 안하셨다면 해주세요! 설정 > Zen Inventory > 알림 > 알림 허용.\n' +
            '처음 사용하는 유저는 로그인 할때 알림 허용 하라는 메시지가 나올것입니다.\n' +
            '이미 하셨다면, 이 메시지를 무시 해주세요.')
    }
  }, [])

  return (
    <div>
      <Toaster position='top-center'  reverseOrder={false}/>
      <BrowserRouter>
        <LoginStatus />
        <Routes>
          <Route
            path='/'
            element={<ProtectedRoute>
              <Home />
            </ProtectedRoute>} 
          />
          <Route
            path='/managercompletedorders'
            element={<ProtectedRoute>
              <ManagerCompletedOrder />
            </ProtectedRoute>} 
          />
          <Route
            path='/managerorderlist'
            element={<ProtectedRoute>
              <ManagerOrderList />
            </ProtectedRoute>} 
          />
          <Route
            path='/ordercreate'
            element={<ProtectedRoute>
              <OrderCreate />
            </ProtectedRoute>} 
          />
          <Route
            path='/workercompletedorders'
            element={<ProtectedRoute>
              <WorkerCompletedOrders />
            </ProtectedRoute>} 
          />
          <Route
            path='/order/:orderId/:role'
            element={<ProtectedRoute>
              <OrderDetail />
            </ProtectedRoute>} 
          />
          <Route
            path='/orderupdate/:orderId'
            element={<ProtectedRoute>
              <OrderUpdate />
            </ProtectedRoute>} 
          />
          <Route path='/initial' element={<Initial />} />
          <Route path='/login' element={<Login />} />
          <Route path='/logout' element={<Logout />} />
          <Route path='/register' element={<RegisterAndLogout />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  )
}

export default App
