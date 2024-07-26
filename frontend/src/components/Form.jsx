import { useState } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants'
import '../styles/Form.css'

function Form({route, method}) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const name = method === 'login' ? 'Log In 로그인' : 'Register 유저 생성'

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault()

        try {
            if (method === 'register'){
                if (password.match('[^0-9]') || password.length != 4){
                    alert('PIN Can Only Contain 4 Digits\n핀넘버는 4개의 숫자만을 사용해야합니다')
                } else {
                    const res = await api.post(route, {username, password})
                    navigate('/login')
                }
            } else {
                const res = await api.post(route, {username, password})
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh)
                navigate('/')
            }   
        } catch (error) {
            if(method === 'register') {
                alert('User with Same Name exists\n같은 이름의 유저가 존재합니다')
            }else{
                alert('Invalid Name or PIN \n맞지않은 이름 혹은 핀번호 입니다')
            }
        } finally {
            setLoading(false)
        }
    }

    return <div className="login-box">
        <form onSubmit={handleSubmit}>
            <h1>{name}</h1>
            <div className="user-box">
                <input 
                    type='text'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <label>Name 이름</label>
            </div>
            <div className="user-box">
                <input 
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <label>PIN 핀번호</label>
            </div><center>
            <button type='submit'>
                    {name}
            </button></center>
        </form>
    </div>
}

export default Form