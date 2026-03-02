import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { count } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    return user.role === 'seller' ? '/seller-dashboard' : '/buyer-dashboard';
  };

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navContent}`}>
        <Link to="/" className={styles.logo}>
          🛍️ EcommercePro
        </Link>

        {/* Desktop Menu */}
        <div className={styles.desktopMenu}>
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          {/* REMOVED Route FROM HERE */}

          {isAuthenticated ? (
            <>
              <Link to={getDashboardPath()}>Dashboard</Link>

              {user?.role === 'buyer' && (
                <Link to="/cart" className={styles.cartLink}>
                  <FiShoppingCart size={24} />
                  {count > 0 && (
                    <span className={styles.cartBadge}>{count}</span>
                  )}
                </Link>
              )}

              <button onClick={handleLogout} className="btn btn-danger">
                <FiLogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
              <Link to="/signup" className="btn btn-outline">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className={styles.hamburger}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={styles.mobileMenu}>
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>

            <Link to="/shop" onClick={() => setMobileMenuOpen(false)}>
              Shop
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>

                {user?.role === 'buyer' && (
                  <Link
                    to="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Cart ({count})
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className={styles.mobileLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

