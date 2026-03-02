import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products/get-all');
      setProducts(data.data || []);
    } catch (e) {
      console.error('Failed to fetch products', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section style={{ background: 'linear-gradient(135deg, var(--primary), #ec4899)', color: 'white', padding: '80px 0', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>Welcome to EcommercePro</h1>
          <p style={{ fontSize: '18px', marginBottom: '30px' }}>Discover amazing products from trusted sellers</p>
          <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
        </div>
      </section>

      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Featured Products</h2>
          {loading ? <p>Loading...</p> : <div className="grid">{products.map(p => <ProductCard key={p._id} product={p} />)}</div>}
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/shop" className="btn btn-primary">View All Products</Link>
          </div>
        </div>
      </section>
    </div>
  );
}


