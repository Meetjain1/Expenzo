import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import './AuthLayout.css';

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-layout">
      <Navbar />
      <main className="auth-main content-area">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default AuthLayout; 