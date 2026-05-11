import { useState, useEffect } from 'react'
import '../styles/OrderList.css'
import { fetchLocationData, fetchUserRoleData } from '../utils/dataFetchutils'
import LoadingIndicator from '../components/LoadingIndicator'
import { useNavigate } from 'react-router-dom'

function LocationList() {
    const [locations, setLocations] = useState([])
    const [loading, setLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)
    const navigate = useNavigate()

    const direct = (locationId, method) => {
        if (method === 'new'){
            navigate('/create-location')
        } else if (method === 'update'){
            navigate('/update-location/' + locationId)
        } else if (method === 'delete'){
            navigate('/delete-location/' + locationId)
        }
    }

    const getUserRoleAndLocationData = async () => {
        const locationsData = await fetchLocationData()
        locationsData.sort((a, b) => a.id - b.id)
        setLocations(locationsData)
        try{
            const userRole = await fetchUserRoleData()

            if(userRole[0].role == 'Master' || userRole[0].role == 'Admin') {
                setIsAdmin(true)
            }
        } catch (error) {
          console.error(error)
        }
        setLoading(false)
    }

    const directHome = () => {
        navigate('/')
    }

    useEffect(() => {
        getUserRoleAndLocationData()
    }, [])

    if(loading) {
        return <div className='orderListDiv'><LoadingIndicator /></div>
    }

    if(isAdmin == false && !loading) {
        return <div><NotFound /></div>
    }

    return <div className='orderListDiv'>
        <h1 className='titleH1'>Product List</h1>
        <h1 className='titleH1'>품목 목록</h1>
        <div className='item'>
            <button onClick={() => direct(null, 'new')} id='listBtn' className='btn'>Add New 신규 추가</button>
        </div>
        <div className="card">
            <div className="card__title">
                <div id='title' className="card__right" style={{width:'34%'}}>
                    Location<br />지점
                </div>
                <div id='title' className="card__right" style={{width:'33%'}}>
                </div>
                <div id='title' className="card__left" style={{width:'33%'}}>
                </div>
            </div>
            <div className="card__data">
                <div className="card__right" style={{width:'34%'}}>
                    {locations.map(location => (
                        <div key={location.id} className='item'>
                            {location.location}
                        </div>
                    ))}
                </div>
                <div className="card__right" style={{width:'33%'}}>
                    {locations.map(location => (
                        <div key={location.id} className='item'>
                            <button onClick={() => direct(location.id, 'update')} id='listBtn' className='btn'>Modify 수정</button>
                        </div>
                    ))}
                </div>
                <div className="card__left" style={{width:'33%'}}>
                    {locations.map(location => (
                        <div key={location.id} className='item'>
                            <button onClick={() => direct(location.id, 'delete')} id='listBtn' className='btn'>Delete 삭제</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        <button onClick={() => directHome()} className="btn">Home 홈페이지</button>
    </div>
}

export default LocationList