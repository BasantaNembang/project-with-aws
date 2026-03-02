import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function Cart() {
  const { items, total, updateQuantity, removeFromCart } = useCart();

  const handleRemove = (productId) => {
    removeFromCart(productId);
    toast.success('Removed from cart');
  };

  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
        <h2>Your cart is empty</h2>
        <p>Add some products to get started!</p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f3f4f6', borderBottom: '2px solid #d1d5db' }}>
            <th style={{ padding: '12px', textAlign: 'left' }}>Product</th>
            <th style={{ padding: '12px' }}>Price</th>
            <th style={{ padding: '12px' }}>Quantity</th>
            <th style={{ padding: '12px' }}>Total</th>
            <th style={{ padding: '12px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.productId} style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '12px' }}>{item.name}</td>
              <td style={{ padding: '12px' }}>₹{item.price}</td>
              <td style={{ padding: '12px' }}>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={e => updateQuantity(item.productId, parseInt(e.target.value) || 1)}
                  style={{ width: '60px' }}
                />
              </td>
              <td style={{ padding: '12px' }}>₹{(item.price * item.quantity).toFixed(2)}</td>
              <td style={{ padding: '12px' }}>
                <button 
                  className="btn btn-danger" 
                  style={{ padding: '6px 12px', fontSize: '12px' }} 
                  onClick={() => handleRemove(item.productId)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div style={{ marginTop: '20px', fontSize: '18px', fontWeight: 'bold', color: 'var(--primary)' }}>
        Total: ₹{total.toFixed(2)}
      </div>
    </div>
  );
}


