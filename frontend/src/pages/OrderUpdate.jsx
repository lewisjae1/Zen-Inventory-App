import OrderForm from '../components/OrderForm'

function OrderUpdate() {
    return <OrderForm route={'api/order/update/'} method={'update'}/>
}

export default OrderUpdate