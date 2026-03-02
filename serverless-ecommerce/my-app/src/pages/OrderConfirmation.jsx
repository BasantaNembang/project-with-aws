import { useLocation, Link } from 'react-router-dom';
import TimeStamp from '../components/TimeStamp';

export default function OrderConfirmation() {
  const { state } = useLocation();
  const order = state?.order;

  // If no order object is passed via state
  if (!order) {
    return (
      <p style={{ padding: '40px', textAlign: 'center' }}>
        No order found
      </p>
    );
  }




  return (
    <div style={{ padding: '40px 0', textAlign: 'center' }}>
      <div className="container" style={{ maxWidth: '600px' }}>
        <div style={{ fontSize: '60px', marginBottom: '20px' }}>✅</div>
        <h1>Order Confirmed!</h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          Thank you for your purchase
        </p>

        {/* Order Details */}
        <div
          style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'left',
          }}
        >
          <p><strong>Order ID:</strong> {order.id}</p>
          <p><strong>Total:</strong> ₹{order.totalAmount.toFixed(2)}</p>
          <p><strong>Payment:</strong> {order.paymentMethod === 'card' ? 'Card' : 'COD'}</p>
          <p><strong>Status:</strong> {order.orderStatus}</p>
          <p>
            <strong>Date:</strong>{' '}

            {order.createdAt
              ? (<TimeStamp time={order.createdAt} />) : '-'
            }


          </p>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <>
              <p><strong>Shipping Address:</strong></p>
              <p>
                {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                {order.shippingAddress.state} - {order.shippingAddress.zipCode}
              </p>
            </>
          )}

          {/* Ordered Items */}
          {order.items && order.items.length > 0 && (
            <>
              <p><strong>Items:</strong></p>
              <ul>
                {order.items.map(item => (
                  <li key={item.productId}>
                    {item.name} x{item.quantity} - ₹{(item.price * item.quantity).toFixed(2)}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <Link to="/buyer-dashboard" className="btn btn-primary">
            View Orders
          </Link>
          <Link to="/shop" className="btn btn-outline">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}



