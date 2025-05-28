/**
 * @file App.js
 * @author Meet Jain (https://github.com/Meetjain1)
 * @copyright Copyright (c) 2024 Meet Jain
 * @license Proprietary
 */

import React, { useEffect } from 'react';
import "./App.css";
import "./styles/theme.css";
import {BrowserRouter, Routes, Route, Navigate, useLocation} from "react-router-dom";
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
// App.js
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './Pages/Home/Home';
import SetAvatar from './Pages/Avatar/setAvatar';
import Landing from './Pages/Landing/Landing';
import NavbarComponent from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import { ThemeProvider } from './context/ThemeContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Profile from './Pages/Profile/Profile';
import Transactions from './Pages/Transactions/Transactions';
import AddTransaction from './Pages/AddTransaction/AddTransaction';
import { validateEnvironment, protectRuntime, addObfuscationMarkers } from './utils/security';

const PrivateRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  return user ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  return (
    <>
      {!isAuthPage && <NavbarComponent />}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } />
          <Route path="/transactions" element={
            <PrivateRoute>
              <Transactions />
            </PrivateRoute>
          } />
          <Route path="/add-transaction" element={
            <PrivateRoute>
              <AddTransaction />
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/setAvatar" element={
            <PrivateRoute>
              <SetAvatar />
            </PrivateRoute>
          } />
        </Routes>
      </main>
      <Footer />
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="colored"
        limit={1}
      />
    </>
  );
};

const App = () => {
  useEffect(() => {
    // Initialize security measures
    if (!validateEnvironment()) {
      document.body.innerHTML = '<h1>Access Denied</h1><p>Invalid environment detected.</p>';
      return;
    }
    protectRuntime();
    addObfuscationMarkers();
  }, []);

  return (
    <ThemeProvider>
      <div className="App">
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
        {process.env.NODE_ENV === 'production' && (
          <div style={{
            position: 'fixed',
            bottom: 10,
            right: 10,
            opacity: 0.2,
            fontSize: 12,
            pointerEvents: 'none',
            zIndex: 9999
          }}>
            © 2024 Meet Jain - Expenzo
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;