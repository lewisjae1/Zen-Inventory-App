import { useState, useEffect } from 'react'
import '../styles/OrderList.css'
import { fetchAllUserRoleData, fetchAllUsersData, fetchUserData } from '../utils/dataFetchutils'
import LoadingIndicator from '../components/LoadingIndicator'
import { useNavigate } from 'react-router-dom'

function UserRoles() {
    const [userRoles, setUserRoles] = useState([])
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    
    const directDetails = (userId) => {
        navigate('/userrole/' + userId + '/')
    }

    const getUserRoleAndUserData = async () => {
        const myData = await fetchUserData()
        const userRolesData = await fetchAllUserRoleData()
        const usersData = await fetchAllUsersData()

        const excludeMyDataAndMastersFromUser = await usersData.filter(user => user.id !== myData[0].id || user.role !== 'Master')
        excludeMyDataAndMastersFromUser.sort((a, b) => a.id - b.id)

        setUserRoles(userRolesData)
        setUsers(excludeMyDataAndMastersFromUser)
        setLoading(false)
    }

    const directHome = () => {
        navigate('/')
    }

    useEffect(() => {
        getUserRoleAndUserData()
    }, [])

    if(loading) {
        return <div className='orderListDiv'><LoadingIndicator /></div>
    }

    return <div className='orderListDiv'>
        <h1 className='titleH1'>User Roles</h1>
        <h1 className='titleH1'>유저 권한</h1>
        <div className="card">
            <div className="card__title">
                <div id='title' className="card__right" style={{width:'34%'}}>
                    Name 이름
                </div>
                <div id='title' className="card__right" style={{width:'34%'}}>
                    User Role<br />유저 권한
                </div>
                <div className="card__left" style={{width:'34%'}}>
                </div>
            </div>
            <div className="card__data">
                <div className="card__right" style={{width:'34%'}}>
                    {users.map(user => (
                        <div key={user.id} className='item'>
                            {user.username}
                        </div>
                    ))}
                </div>
                <div className="card__right" style={{width:'34%'}}>
                    {users.map(user => (
                        <div key={user.id} className='item'>
                            {userRoles[userRoles.findIndex(userRole => userRole.user === user.id)].role}
                        </div>
                    ))}
                </div>
                <div className="card__left" style={{width:'34%'}}>
                    {users.map(user => (
                        <div key={user.id} className='item'>
                            <button onClick={() => directDetails(user.id)} id='listBtn' className='btn'>Modify 수정</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        <button onClick={() => directHome()} className="btn">Home 홈페이지</button>
    </div>
}

export default UserRoles