import { useEffect, useState } from 'react'
import '../styles/LoginStatus.css'
import { useNavigate, useLocation } from 'react-router-dom'
import { fetchUserData } from '../utils/dataFetchutils'
import api from '../api'
import { getToken } from 'firebase/messaging'
import { messaging } from '../firebase'
import { REFRESH_TOKEN, ACCESS_TOKEN } from '../constants'
import {jwtDecode} from 'jwt-decode'

function LoginStatus() {
    const [user, setUser] = useState(null)
    const navigate = useNavigate()
    const location = useLocation()

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const isStandAlone = window.navigator.standalone === true

    const handleClick = async () => {
      if (!isIOS || isStandAlone){
        const token = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_VAPID_KEY
        })
        const tokenData = await api.get('/api/get-token/')
        if(tokenData.data){
          const filteredToken = tokenData.data.filter(data => data.token === token)
          const res = await api.delete('/api/delete-token/' + filteredToken[0].id + '/')
        }
      }   
      setUser(null)
      if(navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage('CLEAR_CACHE')
      }
      navigate('/logout')
    }

    const getUserData = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN)
      const decoded = jwtDecode(token)
      const tokenExpiration = decoded.exp
      const now = Date.now() / 1000

      if(tokenExpiration < now) {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN)
        try {
            const res = await api.post('/api/token/refresh/', {
                refresh: refreshToken,
            })
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
            }
        } catch (error) {
            console.log(error)
        }
      }
      try {
        const data = await fetchUserData()
        if (data) {
          setUser(data[0])
        }
      } catch (error) {
        console.error(error)
      }
    }

    useEffect(() => {
        getUserData()
      }, [location])

    if(!user){
        return
    }

    return <header>
        Welcome, {user.username}<br/>
        환영합니다, {user.username}님<br/>
        <button onClick={() => handleClick()} className="logoutBtn">
        <div className="sign">
            <svg viewBox="0 0 512 512">
                <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
            </svg>
        </div>
        <div className="logoutText">Logout</div>
        </button>
    </header>

    
}

export default LoginStatus