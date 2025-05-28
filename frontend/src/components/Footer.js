import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="auth-footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Expenzo. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer; 