import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const { getToken } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    paymentMethod: 'card',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {


     console.log("oi")
     console.log(user?.email)


    e.preventDefault();

    if (items.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    setLoading(true);
    try {
      const token = getToken();
      const headers = { Authorization: `Bearer ${token}` };

      // Send order to backend
      const data = await api.post('/orders/create', {
        items: items.map(item => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: {
          street: form.address,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode,
        },
        paymentMethod: form.paymentMethod,
        totalAmount: total,
        user: user?.email
      }, { headers });


      // Clear cart on successful order
      clearCart();
      toast.success('Order placed successfully!');
      console.log(data.data)

      navigate('/order-confirmation', { state: { order: data.data } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Your cart is empty. Please add items before checkout.</p>
      </div>
    );
  }



  return (
    <div style={{ padding: '40px 0' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
          <form onSubmit={handleSubmit}>
            <h2>Shipping Information</h2>

            <input
              required
              value={form.name}
              onChange={handleChange}
              name="name"
              placeholder="Full Name"
              style={{ marginBottom: '10px' }}
            />

            <input
              required
              type="email"
              value={form.email}
              onChange={handleChange}
              name="email"
              placeholder="Email"
              style={{ marginBottom: '10px' }}
            />

            <input
              required
              value={form.phone}
              onChange={handleChange}
              name="phone"
              placeholder="Phone"
              style={{ marginBottom: '10px' }}
            />

            <textarea
              required
              value={form.address}
              onChange={handleChange}
              name="address"
              placeholder="Address"
              style={{ marginBottom: '10px' }}
              rows={3}
            />

            <input
              required
              value={form.city}
              onChange={handleChange}
              name="city"
              placeholder="City"
              style={{ marginBottom: '10px' }}
            />

            <input
              required
              value={form.state}
              onChange={handleChange}
              name="state"
              placeholder="State"
              style={{ marginBottom: '10px' }}
            />

            <input
              required
              value={form.zipCode}
              onChange={handleChange}
              name="zipCode"
              placeholder="Zip Code"
              style={{ marginBottom: '20px' }}
            />

            <h2>Payment Method</h2>

            <label style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={form.paymentMethod === 'card'}
                onChange={handleChange}
              />
              Credit/Debit Card
            </label>

            <label style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center' }}>
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={form.paymentMethod === 'cod'}
                onChange={handleChange}
              />
              Cash on Delivery
            </label>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </form>

          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', height: 'fit-content' }}>
            <h3>Order Summary</h3>
            {items.map(item => (
              <div
                key={item.productId}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  borderBottom: '1px solid #eee',
                }}
              >
                <span>{item.name} x{item.quantity}</span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div
              style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: 'var(--primary)',
                marginTop: '15px',
              }}
            >
              Total: ₹{total.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}





