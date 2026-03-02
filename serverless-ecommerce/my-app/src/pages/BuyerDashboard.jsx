import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import TimeStamp from '../components/TimeStamp';

export default function BuyerDashboard() {
  const { user, getToken } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user?.role !== 'buyer') {
      navigate('/login');
    } else {
      fetchOrders();
    }
  }, [user, navigate]);


  console.log("hava")
  console.log(user?.email)

  const fetchOrders = async () => {
    try {
      const token = getToken();
      const { data } = await api.get(`/orders/${user?.email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // backend should return array of Order objects
      setOrders(data || []);
    } catch (e) {
      console.error('Failed to fetch', e);
    }
  };

  

  return (
    <div style={{ padding: '40px 0' }}>
      <div className="container">
        <h1>My Dashboard</h1>
        <p>Welcome, {user?.name}!</p>

        <h2 style={{ marginTop: '30px', marginBottom: '20px' }}>My Orders</h2>
        {orders.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e5e7eb' }}>
            <thead>
              <tr style={{ background: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '10px', textAlign: 'left', borderRight: '1px solid #e5e7eb' }}>Order ID</th>
                <th style={{ padding: '10px', borderRight: '1px solid #e5e7eb' }}>Items</th>
                <th style={{ padding: '10px', borderRight: '1px solid #e5e7eb' }}>Total</th>
                <th style={{ padding: '10px', borderRight: '1px solid #e5e7eb' }}>Status</th>
                <th style={{ padding: '10px' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '10px', borderRight: '1px solid #e5e7eb' }}>{o.id.substring(0, 8)}...</td>
                  <td style={{ padding: '10px', borderRight: '1px solid #e5e7eb' }}>{o.items?.length}</td>
                  <td style={{ padding: '10px', borderRight: '1px solid #e5e7eb' }}>₹{o.totalAmount?.toFixed(2) || 0}</td>
                  <td style={{ padding: '10px', borderRight: '1px solid #e5e7eb' }}>{o.orderStatus}</td>
                  <td style={{ padding: '10px' }}>{o.createdAt ? (<TimeStamp time={o.createdAt} />) : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No orders yet</p>
        )}
      </div>
    </div>
  );
}

