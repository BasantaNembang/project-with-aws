import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import './HomePage.css';
import { useEffect } from 'react';
import { isLoggedIn, logOut } from '../../apis/authAPI';

const HomePage = () => {
  const navigate = useNavigate();

  const checkAUTH = async () => {
    const response = await isLoggedIn();
    if (response === "isLoggedIN") {
      navigate("/")
    }
    else if (response === 403) {
      navigate("/auth")
    }
  }

  useEffect(() => {
    checkAUTH()
  }, []);

  const handleLogout = async () => {
    const response = await logOut();
    if (response === 200) {
      navigate("/auth")
    }
  };

  const handleNavigate = (section: 'images' | 'videos') => {
    navigate(`/${section}`);
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="home-content">
        <div className="welcome-section">
          <h2>Welcome, Basanta</h2>
          <p>Explore images and videos</p>
        </div>

        <div className="cards-grid">
          <div
            className="card image-card"
            onClick={() => handleNavigate('images')}
            role="button"
            tabIndex={0}
          >
            <h3>Image Section</h3>
            <p>View and share photos</p>
            <div className="card-arrow">→</div>
          </div>

          <div
            className="card video-card"
            onClick={() => handleNavigate('videos')}
            role="button"
            tabIndex={0}
          >
            <h3>Video Section</h3>
            <p>Watch and share videos</p>
            <div className="card-arrow">→</div>
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default HomePage;

