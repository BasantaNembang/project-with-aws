import React from 'react';
import './Header.css';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onBackClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, onBackClick }) => {
  return (
    <header className="header">
      {onBackClick && (
        <button className="back-button" onClick={onBackClick}>
          ←
        </button>
      )}
      <div className="header-content">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </header>
  );
};

export default Header;

