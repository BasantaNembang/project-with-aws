import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await api.get(`/products/get/${id}`);
      setProduct(data.data);
    } catch (e) {
      toast.error('Failed to load product');
      navigate('/shop');
    } finally {
      setLoading(false);
    }
  };


  const handleAdd = () => {
  if (!isAuthenticated) {
    toast.error('Please login to add items to cart');
    navigate('/login');
    return;
  }

  if (user.role !== 'buyer') {
    toast.error('Only buyers can add items to cart');
    return;
  }

  addToCart(product, qty);   
  toast.success('Added to cart');
  setQty(1);
};


  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  if (!product) return <div style={{ padding: '40px', textAlign: 'center' }}>Product not found</div>;

  return (
    <div style={{ padding: '40px 0' }}>
      <div className="container">
        <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ marginBottom: '20px' }}>
          ← Back
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          {/* Product Image */}
          <div>
            <img 
              src={product.image} 
              style={{ width: '100%', borderRadius: '8px' }}
            />
          </div>

          {/* Product Details */}
          <div>
            <h1>{product.name}</h1>
            
            <h2 style={{ color: 'var(--primary)', marginTop: '15px', fontSize: '28px' }}>
              ₹{product.price}
            </h2>
            
            <p style={{ color: '#666', marginTop: '20px', lineHeight: '1.6', fontSize: '15px' }}>
              {product.description}
            </p>

            <div style={{ marginTop: '20px', padding: '15px', background: '#f3f4f6', borderRadius: '8px' }}>
              <p style={{ marginBottom: '10px' }}>
                <strong>Category:</strong> {product.category}
              </p>
              <p>
                <strong>Stock:</strong> {product.stock > 0 ? `${product.stock} available` : 'Out of Stock'}
              </p>
            </div>

            {/* {product.stock > 0 ? ( */}
              <div style={{ marginTop: '30px' }}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Quantity:</label>
                    <input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={qty}
                      onChange={(e) => setQty(Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1)))}
                      style={{ width: '80px' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>&nbsp;</label>
                    <button className="btn btn-primary" onClick={handleAdd} style={{ width: '100%' }}>
                      Add to Cart
                    </button>
                  </div>
                </div>
                {!isAuthenticated && (
                  <p style={{ color: '#ef4444', fontSize: '13px' }}>
                    Please <a href="/login" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>login</a> to purchase
                  </p>
                )}
              </div>
            ) : (
              <div style={{ marginTop: '30px', padding: '15px', background: '#fecaca', borderRadius: '8px', color: '#dc2626' }}>
                <strong>Out of Stock</strong>
              </div>
            {/* )} */}
          </div>
        </div>
      </div>
    </div>
  );
}

