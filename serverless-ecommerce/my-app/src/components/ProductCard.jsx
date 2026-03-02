import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product, onEdit, onDelete, isSeller = false }) {
  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();


  const handleAdd = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items');
      navigate('/login');
      return;
    }

    if (user?.role !== 'buyer') {
      toast.error('Only buyers can add items to cart');
      return;
    }

    if (product.stock <= 0) {
      toast.error('Out of stock');
      return;
    }

    // Pass entire product object
    addToCart(product, 1);
    toast.success('Added to cart');
  };
  return (
    <div className="card">
      {/* Link to product detail */}
      <Link to={`/product/${product.productId}`} style={{ display: 'block', marginBottom: '10px' }}>
        <img
          src={product.image}
          alt={product.name}
          style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '6px', cursor: 'pointer' }}
        />
        <h3 style={{ marginTop: '10px', color: 'var(--primary)' }}>{product.name}</h3>
      </Link>

      <p style={{ color: '#666', fontSize: '13px' }}>{product.description.substring(0, 50)}...</p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
        <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--primary)' }}>₹{product.price}</span>
        {product.stock > 0 && <span style={{ color: '#10b981' }}>✓ In Stock</span>}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
        {isSeller ? (
          <>
            <button className="btn btn-primary" style={{ flex: 1, fontSize: '12px' }} onClick={() => onEdit(product)}>
              Edit
            </button>
            <button className="btn btn-danger" style={{ flex: 1, fontSize: '12px' }} onClick={() => onDelete(product._id)}>
              Delete
            </button>
          </>
        ) : (
          <button
            className="btn btn-primary"
            style={{ flex: 1 }}
            onClick={handleAdd}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        )}
      </div>
    </div>
  );
}

