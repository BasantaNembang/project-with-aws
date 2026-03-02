import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'buyer' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await signup(form);
    setLoading(false);
    if (res.success) {
      toast.success('Signup successful!');
      console.log(res.user)
      console.log("rolessss")
      navigate(res.user.role === 'seller' ? '/seller-dashboard' : '/buyer-dashboard');
    } else {
      toast.error(res.error);
    }
  };

  
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 80px)', padding: '40px 20px' }}>
      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ marginBottom: '30px' }}>Sign Up</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Name</label>
          <input type="text" required autoFocus disabled={loading} value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="John Doe" />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Email</label>
          <input type="email" required disabled={loading} value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="your@email.com" />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Password</label>
          <input type="password" required disabled={loading} value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="••••••" />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Role</label>
          <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginBottom: '15px' }}>
          {loading ? 'Creating...' : 'Sign Up'}
        </button>

        <p style={{ textAlign: 'center', color: '#666' }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

