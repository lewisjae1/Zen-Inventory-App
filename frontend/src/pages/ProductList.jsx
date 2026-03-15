import { useState, useEffect } from 'react'
import '../styles/OrderList.css'
import { fetchProductData } from '../utils/dataFetchutils'
import LoadingIndicator from '../components/LoadingIndicator'
import { useNavigate } from 'react-router-dom'

function ProductList() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const direct = (productId, method) => {
        if (method === 'new'){
            navigate('/create-product')
        } else if (method === 'update'){
            navigate('/update-product/' + productId)
        } else if (method === 'delete'){
            navigate('/delete-product/' + productId)
        }
    }

    const getUserRoleAndUserData = async () => {
        const productsData = await fetchProductData()

        setProducts(productsData)
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
        <h1 className='titleH1'>Product List</h1>
        <h1 className='titleH1'>품목 목록</h1>
        <div className='item'>
            <button onClick={() => direct(null, 'new')} id='listBtn' className='btn'>Add New 신규 추가</button>
        </div>
        <div className="card">
            <div className="card__title">
                <div id='title' className="card__right">
                    Product<br />품목
                </div>
                <div id='title' className="card__right">
                    Price<br />가격
                </div>
                <div id='title' className="card__right">
                </div>
                <div className="card__left">
                </div>
            </div>
            <div className="card__data">
                <div className="card__right">
                    {products.map(product => (
                        <div key={product.id} className='item' style={{fontSize:'9px'}}>
                            {product.productName}
                        </div>
                    ))}
                </div>
                <div className="card__right">
                    {products.map(product => (
                        <div key={product.id} className='item'>
                            {product.price}
                        </div>
                    ))}
                </div>
                <div className="card__right">
                    {products.map(product => (
                        <div key={product.id} className='item'>
                            <button onClick={() => direct(product.id, 'update')} id='listBtn' className='btn'>Modify 수정</button>
                        </div>
                    ))}
                </div>
                <div className="card__left">
                    {products.map(product => (
                        <div key={product.id} className='item'>
                            <button onClick={() => direct(product.id, 'delete')} id='listBtn' className='btn'>Delete 삭제</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        <button onClick={() => directHome()} className="btn">Home 홈페이지</button>
    </div>
}

export default ProductList