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

function App() {
  useEffect (() => {
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload)
      toast.success(payload.data.body)
    })
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Notification Permission Granted.')
      } else if(permission === 'denied') {
        alert('You denied for the notification')
        alert('notification permission: ', permission)
      }
    })
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
