import { useNavigate } from 'react-router-dom'
import '../styles/Initial.css'
import ZenLogo from '../assets/ZenRamen_Logo1024_1.jpg'

function Initial() {
    const navigate = useNavigate()

    const handleClick = (route) => {
        if (route === 'login' ){
            navigate('/login')
        } else if (route === 'register') {
            navigate('/register')
        }
    }

    return <div className='initialDiv'>
            <img src={ZenLogo} alt='Logo' width={200} height={100}/>
            <button onClick={() => handleClick('login')} className="btn">Log In 로그인</button>
            <button onClick={() => handleClick('register')} className="btn">Register 유저 생성</button>
    </div>
}

export default Initial