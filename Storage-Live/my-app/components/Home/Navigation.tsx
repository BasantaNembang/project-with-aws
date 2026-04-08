import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Navigation.css';

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bottom-navigation">
      <button
        className={`nav-item ${isActive('/home') ? 'active' : ''}`}
        onClick={() => navigate('/home')}
      >
        {/* <span className="nav-icon">🏠</span> */}
        <span className="nav-label">Home</span>
      </button>

      <button
        className={`nav-item ${isActive('/images') ? 'active' : ''}`}
        onClick={() => navigate('/images')}
      >
        {/* <span className="nav-icon">🖼️</span> */}
        <span className="nav-label">Images</span>
      </button>

      <button
        className={`nav-item ${isActive('/videos') ? 'active' : ''}`}
        onClick={() => navigate('/videos')}
      >
        {/* <span className="nav-icon">🎬</span> */}
        <span className="nav-label">Videos</span>
      </button>
    </nav>
  );
};

export default Navigation;


