import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import './styles/Render.css'
import Login from './pages/Login'
import Home from './pages/Home'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import Initial from './pages/Initial'
import LoginStatus from './components/LoginStatus'
import Footer from './components/Footer'

function Logout() {
  localStorage.clear()
  return <Navigate to ='/initial' />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

function App() {
  return (
    <>
    <BrowserRouter>
      <LoginStatus />
      <Routes>
        <Route
          path='/'
          element={<ProtectedRoute>
            <Home />
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
    </>
  )
}

export default App
