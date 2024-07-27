import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import Footer from './components/Footer'
import Initial from './pages/Initial'

function Logout() {
  localStorage.clear()
  return <Navigate to ='/login' />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path='/home'
            element={<ProtectedRoute>
              <Home />
            </ProtectedRoute>} 
          />
          <Route path='/' element={<Initial />} />
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
