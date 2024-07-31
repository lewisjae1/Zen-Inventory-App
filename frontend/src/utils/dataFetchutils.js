import api from '../api';

export const fetchUserData = async () => {
    try {
        const res = await api.get('api/user/')
        return res.data
    } catch (error) {
        console.error(error)
    }
}