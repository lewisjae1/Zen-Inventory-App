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
import IOSNotification from './components/IOSNotification'
import UserRoles from './pages/UserRoles'
import { onMessage } from 'firebase/messaging'
import { messaging } from './firebase'
import toast, { Toaster } from 'react-hot-toast'
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants'
import UserRolesUpdate from './pages/UserRolesUpdate'
import ProductList from './pages/ProductList'
import ProductCreate from './pages/ProductCreate'

function Logout() {
  localStorage.removeItem(ACCESS_TOKEN)
  localStorage.removeItem(REFRESH_TOKEN)
  return <Navigate to ='/initial' />
}

function RegisterAndLogout() {
  localStorage.removeItem(ACCESS_TOKEN)
  localStorage.removeItem(REFRESH_TOKEN)
  return <Register />
}

const isIOS = /iPad|iPhone|iPod|Mac/.test(navigator.userAgent)
const isStandAlone = window.navigator.standalone === true

const notificationCheck = () => {
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification Permission Granted.')
    } else if(permission === 'denied') {
      console.log('You denied for the notification')
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
      alert('Welcome! If You Haven\'t Allowed Notification Please Do So by Enable Notfication.\n' +
            '환영합니다! 아직 알림 설정을 안하셨다면 알림 설정 버튼을 통해 해주세요!.\n')
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
          <Route
            path='/userroles'
            element={<ProtectedRoute>
              <UserRoles />
            </ProtectedRoute>} 
          />
          <Route
            path='/userrole/:userId'
            element={<ProtectedRoute>
              <UserRolesUpdate />
            </ProtectedRoute>} 
          />
          <Route
            path='/productList'
            element={<ProtectedRoute>
              <ProductList />
            </ProtectedRoute>} 
          />
          <Route
            path='/create-product'
            element={<ProtectedRoute>
              <ProductCreate />
            </ProtectedRoute>} 
          />
          <Route path='/initial' element={<Initial />} />
          <Route path='/login' element={<Login />} />
          <Route path='/logout' element={<Logout />} />
          <Route path='/register' element={<RegisterAndLogout />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      {
        (isIOS && isStandAlone) &&
        <IOSNotification />
      }
      <Footer />
    </div>
  )
}

export default App
