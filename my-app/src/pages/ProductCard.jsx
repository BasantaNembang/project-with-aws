// import { Link } from 'react-router-dom';
// import { useCart } from '../context/CartContext';
// import toast from 'react-hot-toast';

// export default function ProductCard({ product, onEdit, onDelete, isSeller = false }) {
//   const { addToCart } = useCart();

//   const handleAdd = async () => {
//     const res = await addToCart(product._id, 1);
//     if (res.success) toast.success('Added to cart');
//     else toast.error(res.error);
//   };

//   return (
//     <div className="card">
//       {/* Link to product detail page */}
//       <Link to={`/product/${product._id}`} style={{ display: 'block', marginBottom: '10px' }}>
//         <img 
//           src={product.imageUrl || 'https://via.placeholder.com/250'} 
//           alt={product.name}
//           style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '6px', cursor: 'pointer' }} 
//         />
//         <h3 style={{ marginTop: '10px', color: 'var(--primary)' }}>{product.name}</h3>
//       </Link>
      
//       <p style={{ color: '#666', fontSize: '13px' }}>{product.description.substring(0, 50)}...</p>
      
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
//         <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--primary)' }}>₹{product.price}</span>
//         {product.stock > 0 && <span style={{ color: '#10b981' }}>✓ In Stock</span>}
//       </div>

//       <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
//         {isSeller ? (
//           <>
//             <button className="btn btn-primary" style={{ flex: 1, fontSize: '12px' }} onClick={() => onEdit(product)}>
//               Edit
//             </button>
//             <button className="btn btn-danger" style={{ flex: 1, fontSize: '12px' }} onClick={() => onDelete(product._id)}>
//               Delete
//             </button>
//           </>
//         ) : (
//           <button 
//             className="btn btn-primary" 
//             style={{ flex: 1 }} 
//             onClick={handleAdd} 
//             disabled={product.stock === 0}
//           >
//             {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }



import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product, onEdit, onDelete, isSeller = false }) {
  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const handleAdd = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items');
      return;
    }

    if (user.role !== 'buyer') {
      toast.error('Only buyers can add items to cart');
      return;
    }

    const res = await addToCart(product._id, 1);
    if (res.success) toast.success('Added to cart');
    else toast.error(res.error);
  };

  return (
    <div className="card">
      {/* Link to product detail - BUYERS CAN CLICK */}
      <Link to={`/product/${product._id}`} style={{ display: 'block', marginBottom: '10px' }}>
        <img 
          src={product.imageUrl || 'https://via.placeholder.com/250'} 
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



