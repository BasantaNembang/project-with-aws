import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Cart from '../components/Cart';

export default function CartPage() {
  const { items } = useCart();

  return (
    <div style={{ padding: '40px 0' }}>
      <div className="container">
        <h1>Shopping Cart</h1>
        <div style={{ marginTop: '30px' }}>
          <Cart />
          {items.length > 0 && (
            <div style={{ marginTop: '30px', textAlign: 'right' }}>
              <Link to="/checkout" className="btn btn-primary" style={{ marginLeft: '10px' }}>
                Proceed to Checkout
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


