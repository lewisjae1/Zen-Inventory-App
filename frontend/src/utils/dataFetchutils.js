import api from '../api';

export const fetchUserData = async () => {
    try {
        const res = await api.get('api/user/')
        return res.data
    } catch (error) {
        console.error(error)
    }
}

export const fetchAllUsersData = async () => {
    try {
        const res = await api.get('api/allusers/')
        return res.data
    } catch (error) {
        console.error(error)
    }
}

export const fetchProductData = async () => {
    try{
        const res = await api.get('api/product/')
        return res.data
    } catch (error) {
        console.error(error)
    }
}

export const fetchOrderData = async () => {
    try {
        const res = await api.get('api/order/')
        return res.data
    } catch (error) {
        console.error(error)
    }
}

export const fetchOrderProductData = async () => {
    try {
        const res = await api.get('api/orderproduct/')
        return res.data
    } catch (error) {
        console.error(error)
    }
}