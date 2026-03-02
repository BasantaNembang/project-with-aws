import { useEffect, useState } from 'react';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [search, category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);

      //const { data } = await api.get(`/products?${params}`);
      const data = await api.get(`/products/get-all`);
      setProducts(data.data || []);
    } catch (e) {
      console.error('Failed to fetch products', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px 0' }}>
      <div className="container">
        <h1>Shop Products</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '30px', marginTop: '30px' }}>
          {/* Sidebar - Filters */}
          <aside>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Search</label>
              <input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="books">Books</option>
                <option value="home">Home & Garden</option>
                <option value="sports">Sports</option>
              </select>
            </div>
          </aside>

          {/* Main Content - Products Grid */}
          <main>
            {loading ? (
              <p>Loading...</p>
            ) : products.length > 0 ? (
              <div className="grid">
                {products.map(p => (
                  <ProductCard key={p.productId} product={p} />
                ))}
              </div>
            ) : (
              <p>No products found</p>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}


