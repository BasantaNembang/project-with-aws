import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      toast.success('Login successful!');
      navigate(res.user.role === 'seller' ? '/seller-dashboard' : '/buyer-dashboard');
    } else {
      toast.error(res.error);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 80px)', padding: '40px 20px' }}>
      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ marginBottom: '30px' }}>Login</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Email</label>
          <input type="email" required autoFocus disabled={loading} value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Password</label>
          <input type="password" required disabled={loading} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••" />
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginBottom: '15px' }}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p style={{ textAlign: 'center', color: '#666' }}>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
}
