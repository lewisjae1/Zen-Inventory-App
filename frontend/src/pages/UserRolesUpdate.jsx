import { fetchUserRoleData, fetchAllUserRoleData, fetchAllUsersData } from '../utils/dataFetchutils'
import { useEffect, useState } from 'react'
import LoadingIndicator from '../components/LoadingIndicator'
import '../styles/OrderForm.css'
import api from '../api'
import { useNavigate, useParams } from 'react-router-dom'
import NotFound from './NotFound'

function UserRolesUpdate() {
    const [userRole, setUserRole] = useState(null)
    const [userName, setUserName] = useState(null)
    const [role, setRole] = useState(null)
    const navigate = useNavigate()
    const {userId} = useParams()
    const [loading, setLoading] = useState(true)
    const [Completed, setCompleted] = useState(false)
    const [permission, setPermission] = useState(true)

    const getAllNecessaryData = async () => {
        try {
            const allUserRoleData = await fetchAllUserRoleData()
            const userRoleData = await fetchUserRoleData()

            const allUsers = await fetchAllUsersData()
            
            if (userRoleData[0].role != 'Master') {
                setPermission(false)
            }

            const filteredUserRole = await allUserRoleData.filter(userRoles => userRoles.user == userId)
            
            const filteredUser = await allUsers.filter(users => users.id == userId)

            setUserRole(filteredUserRole[0])

            setUserName(filteredUser[0].username)

        } catch (error) {
          console.error(error)
        } finally {
          setLoading(false)
        }
      }
    
    const directHome = () => {
      navigate('/')
    }

    const handleSubmit = async (e) => {
      setLoading(true)
      e.preventDefault()
      const userRoleData = {
        user: userId,
        role: role
      }
      try {
        const res = await api.put('api/userrole/update/' + userRole.id + '/', userRoleData)
        setCompleted(true)
      } catch(error) {
        console.log(error)
        if (navigator.onLine){
          alert('Error Occured. Contact Administrator.\n오류가 발생했습니다. 관리자에게 문의 해주세요.')
        }
        else if(!navigator.onLine) {
          setCompleted(true)
        }
      } finally {
        setLoading(false)
      }
    }

    useEffect(() => {
        getAllNecessaryData()    
      }, [])

    if(loading) {
        return <div className='orderCreateDiv'><LoadingIndicator /></div>
    }

    if(permission == false) {
        return <div><NotFound /></div>
    }

    if(Completed) {
      return <div className='orderCreateDiv'>
        <div className="success">
          <div className="success__icon">
            <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path clipRule="evenodd" d="m12 1c-6.075 0-11 4.925-11 11s4.925 11 11 11 11-4.925 11-11-4.925-11-11-11zm4.768 9.14c.0878-.1004.1546-.21726.1966-.34383.0419-.12657.0581-.26026.0477-.39319-.0105-.13293-.0475-.26242-.1087-.38085-.0613-.11844-.1456-.22342-.2481-.30879-.1024-.08536-.2209-.14938-.3484-.18828s-.2616-.0519-.3942-.03823c-.1327.01366-.2612.05372-.3782.1178-.1169.06409-.2198.15091-.3027.25537l-4.3 5.159-2.225-2.226c-.1886-.1822-.4412-.283-.7034-.2807s-.51301.1075-.69842.2929-.29058.4362-.29285.6984c-.00228.2622.09851.5148.28067.7034l3 3c.0983.0982.2159.1748.3454.2251.1295.0502.2681.0729.4069.0665.1387-.0063.2747-.0414.3991-.1032.1244-.0617.2347-.1487.3236-.2554z" fill="#393a37" fillRule="evenodd"></path></svg>
          </div>
          {navigator.onLine && <div className="success__title">성공적으로 수정하셨습니다!<br/>Successfully Updated!</div>}
          {!navigator.onLine && <div className="success__title">Your Network Seems Offline. Request Will be Handled When It is Back Online.
            <br/>사용자의 네트워크가 연결되있지 않습니다. 요청은 네트워크가 연결되면 처리 될것입니다.</div>}
        </div>
        <button onClick={() => directHome()} className="btn">Home 홈페이지</button>
      </div>
    }

    return <div className='orderCreateDiv'>
        <div className='login-box'>
            <form onSubmit={handleSubmit}>
                <h1>User Role Update<br/>유저 권한 수정</h1>
                <div className='user-box' id='orderCreateBox'>
                    <input 
                        type= 'text'
                        defaultValue={userName}
                        disabled
                    />
                    <label>Name 이름</label>
                </div>
                <div className='user-box' id='orderCreateBox'>
                    <select defaultValue={userRole.role} onChange={(e) => setRole(e.target.value)} name="role" id="role">
                        <option value=''>Field Required 입력 필수</option>
                        <option value="Admin">Admin</option>
                        <option value="Basic">Basic</option>
                    </select>
                    <label>Location 지점</label>
                </div>
                {loading && <LoadingIndicator />}
                <center>
                    <button className='formButton' type='submit'>
                            권한 수정<br/>Role Update
                    </button>
                </center>
            </form>
            <button onClick={() => directHome()} className="btn">Home 홈페이지</button>
        </div>
    </div>
}

export default UserRolesUpdate