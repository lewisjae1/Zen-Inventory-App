import { useState } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants'
import '../styles/Form.css'

function Form({route, method}) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [accessCode, setAccessCode] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const name = method === 'login' ? 'Log In 로그인' : 'Register 계정 생성'
    const buttonName = method === 'login' ? 'Register 계정 생성' : 'Log In 로그인'
    const redirectPrompt1 = method === 'login' ? 'Don\'t Have an Account?' :
            'Have an Account?'
    const redirectPrompt2 = method === 'login' ? '계정이 없나요?' :
            '계정을 갖고 계신가요?'

    const handleClick = () => {
        if (method === 'login' ){
            navigate('/register')
        } else if (method === 'register') {
            navigate('/login')
        }
    }

    const directInitial = () => {
        navigate('/initial')
    }

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault()

        try {
            if (method === 'register'){
                if (password.match('[^0-9]') || password.length != 4){
                    alert('PIN Can Only Contain 4 Digits\n핀넘버는 4개의 숫자만을 사용해야합니다')
                } else if (accessCode !== 'I love Zen'){
                    alert('Incorrect Access Code\n맞지 않은 암호 입니다')
                }else {
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
        <h3>{redirectPrompt1}</h3>
        <h3>{redirectPrompt2}</h3>
        <button onClick={() => handleClick()} className="btn">{buttonName}</button>
        <form onSubmit={handleSubmit}>
            <h1>{name}</h1>
            <div className="user-box">
                <input 
                    type='text'
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <label>Name 이름</label>
            </div>
            <div className="user-box">
                <input 
                    type='password'
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <label>PIN 핀번호</label>
            </div>
            {method === 'register' &&
                <div className="user-box">
                <input 
                    type='text'
                    onChange={(e) => setAccessCode(e.target.value)}
                    required
                />
                <label>Access Code 암호</label>
                <span className='formSpan'>
                    PIN Must be 4 Digits
                </span>
                <br />
                <span className='formSpan'>
                    핀번호는 4개의 숫자로 이루어져야 합니다
                </span>
                </div>
            }<center>
            <button className='formButton' type='submit'>
                    {name}
            </button></center>
        </form>
        <button onClick={() => directInitial()} className="btn">Start Page 시작 페이지</button>
    </div>
}

export default Form