import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { ThemeContext } from '../context/ThemeContext';
import * as BsIcons from 'react-icons/bs';

const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <nav className="auth-navbar">
      <div className="nav-brand">
        <Link to="/">
          <span className="brand-icon">E</span>
          <span className="brand-text">Expenzo</span>
        </Link>
      </div>
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        style={{ background: 'none', border: 'none', marginLeft: 'auto', cursor: 'pointer', fontSize: '1.25rem', color: 'var(--text-color)' }}
        aria-label="Toggle dark/light mode"
      >
        {theme === 'light' ? <BsIcons.BsMoon /> : <BsIcons.BsSun />}
      </button>
    </nav>
  );
};

export default Navbar; 