import OrderForm from '../components/OrderForm'

function OrderCreate() {
  return <OrderForm route={'api/order/'} method={'create'}/>
}

export default OrderCreate