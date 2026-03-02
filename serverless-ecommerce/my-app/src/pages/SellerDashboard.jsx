import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';
import '../styles/SellerDashboard.css';

export default function SellerDashboard() {
  const { user, getToken } = useAuth();
  const navigate = useNavigate();

  // State
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState('products');
  const [edit, setEdit] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    image: null,
  });

  // Fetch user products and orders
  useEffect(() => {
    if (!user) return;
    if (user.role !== 'seller') navigate('/login');
    else fetchData();
  }, [user, navigate]);


  const fetchData = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch seller's products
      const productsRes = await api.get(`/products/seller/my-products/${user?.email}`, { headers });
      setProducts(productsRes.data || []);


      // Fetch seller's orders
      const ordersRes = await api.get(`/orders/seller/${user?.email}`, { headers });
      setOrders(ordersRes.data || []);
    } catch (e) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Handle field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProductData((prev) => ({ ...prev, image: e.target.files[0] }));
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  // Remove selected image
  const removeImage = () => {
    setProductData((prev) => ({ ...prev, image: null }));
    setPreview(null);
  };

  // Submit form - FIXED FOR YOUR BACKEND
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate image for new products
    if (!edit && !productData.image) {
      toast.error('Please select an image');
      return;
    }
    try {
      const token = getToken();
      const headers = { Authorization: `Bearer ${token}` };

      // Create FormData
      const formData = new FormData();

      // Add product as JSON string (matching @RequestPart("product"))
      const productDTO = {
        name: productData.name,
        description: productData.description,
        price: parseInt(productData.price),
        stock: parseInt(productData.stock),
        category: productData.category,
        email: user?.email
      };
      formData.append('product', JSON.stringify(productDTO));

      // Add image (matching @RequestPart("image"))
      if (productData.image) {
        formData.append('image', productData.image);
      }

      if (edit) {
        // Update product
        await api.put(`/products/${edit._id}`, formData, { 
          headers: { 
            ...headers,
            'Content-Type': 'multipart/form-data' 
          } 
        });
        toast.success('Product updated');
      } else {
        // Create new product - using /products/save endpoint
        await api.post('/products/save', formData, { 
          headers: { 
            ...headers,
            'Content-Type': 'multipart/form-data' 
          } 
        });
        toast.success('Product added');
      }

      // Reset form
      setProductData({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        category: '',
        image: null,
      });
      setEdit(null);
      setPreview(null);
      setTab('products');
      fetchData();
    } catch (err) {
      console.error('Error:', err);
      toast.error(err.response?.data?.message || 'Error saving product');
    }
  };

  // Edit product
  const handleEdit = (product) => {
    setEdit(product);
    setProductData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      image: null,
    });
    setPreview(product.imageUrl || null);
    setTab('add');
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      const token = getToken();
      await api.delete(`/products/${id}`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      toast.success('Product deleted');
      fetchData();
    } catch (e) {
      toast.error('Failed to delete');
    }
  };

  // Get recent products (last 5)
  const recentProducts = products.slice(0, 5);

  if (loading) {
    return <div className="seller-dashboard"><p>Loading...</p></div>;
  }

  return (
    <div className="seller-dashboard">
      <div className="dashboard-container">
        <h1>Seller Dashboard</h1>
        <p>Welcome, {user?.name}!</p>

        {/* Tabs */}
        <div className="tabs">
          {['products', 'orders', 'add'].map((t) => (
            <button key={t} onClick={() => setTab(t)} className={tab === t ? 'active-tab' : ''}>
              {t === 'products' && `Products (${products.length})`}
              {t === 'orders' && `Orders (${orders.length})`}
              {t === 'add' && (edit ? 'Edit Product' : 'Add Product')}
            </button>
          ))}
        </div>

        {/* Products Tab */}
        {tab === 'products' && (
          products.length > 0 ? (
            <div className="product-grid">
              {products.map((p) => (
                <ProductCard
                  key={p.productId}
                  product={p}
                  isSeller
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : <p className="empty-state">No products yet. Add your first product!</p>
        )}

        {/* Orders Tab */}
        {tab === 'orders' && (
          orders.length > 0 ? (
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>{o.id}...</td>
                    <td>{o.user}</td>
                    <td>{o.items?.length || 0}</td>
                    <td>₹{o.totalAmount || 0}</td>
                    <td>
                      <span className={`status-badge status-${o.orderStatus}`}>
                        {o.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p className="empty-state">No orders yet</p>
        )}

        {/* Add/Edit Product Tab */}
        {tab === 'add' && (
          <form className="product-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Product Name *</label>
              <input
                name="name"
                placeholder="Product Name"
                value={productData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                placeholder="Product Description"
                rows={4}
                value={productData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={productData.price}
                  onChange={handleChange}
                  min={0}
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label>Stock Quantity *</label>
                <input
                  type="number"
                  name="stock"
                  placeholder="Stock"
                  value={productData.stock}
                  onChange={handleChange}
                  min={0}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select
                name="category"
                value={productData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="books">Books</option>
                <option value="home">Home & Garden</option>
                <option value="sports">Sports</option>
              </select>
            </div>

            <div className="form-group">
              <label>Product Image {!edit && '*'}</label>
              <div className="image-upload">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  required={!edit}
                />
                {preview && (
                  <div className="image-preview">
                    <img src={preview} alt="Preview" />
                    <button type="button" onClick={removeImage}>Remove</button>
                  </div>
                )}
              </div>
            </div>

            <div className="form-buttons">
              <button type="submit" className="btn btn-primary">
                {edit ? 'Update Product' : 'Add Product'}
              </button>
              {edit && (
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setProductData({
                      name: '',
                      description: '',
                      price: 0,
                      stock: 0,
                      category: '',
                      image: null,
                    });
                    setEdit(null);
                    setPreview(null);
                    setTab('products');
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}

        {/* Recently Added Products */}
        {recentProducts.length > 0 && tab !== 'add' && (
          <div className="recently-added">
            <h2>Recently Added Products</h2>
            <div className="recent-images">
              {recentProducts.map((p) => (
                <div key={p._id} className="recent-image-card">
                  <img src={p.image} alt={p.name} />
                  <p>{p.name}</p>
                  <span>₹{p.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

