import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { registerAPI } from '../../utils/ApiRequest';
import * as BiIcons from 'react-icons/bi';
import AuthLayout from '../../components/AuthLayout';
import { Form, Input } from 'antd';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import config from '../../config/config';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('user')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (formValues) => {
    const { name, email, password } = formValues;
    if (!name || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(registerAPI, formValues);
      if (data.success) {
        toast.success('Registration successful!');
        localStorage.setItem('user', JSON.stringify({ ...data.user, password: '' }));
        navigate('/dashboard');
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const { data } = await axios.post(`${config.apiUrl}/api/auth/google-login`, {
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture
      });
      toast.success('Registration successful');
      localStorage.setItem('user', JSON.stringify({ ...data.user, password: '' }));
      navigate('/dashboard');
    } catch (error) {
      console.error('Google signup error:', error);
      toast.error(error.response?.data?.message || 'Google sign-up failed');
    }
  };

  return (
    <AuthLayout>
      <div className="auth-container">
        <div className="auth-card">
          <div className="brand">
            <h1>Register</h1>
          </div>
          <Form
            name="register-form"
            initialValues={{ remember: true }}
            onFinish={handleSubmit}
          >
            <div className="form-group">
              <label>Full Name</label>
              <Form.Item name="name">
                <Input
                  type="text"
                  placeholder="Enter your full name"
                />
              </Form.Item>
            </div>
            <div className="form-group">
              <label>Email</label>
              <Form.Item name="email">
                <Input
                  type="email"
                  placeholder="Enter your email"
                />
              </Form.Item>
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="password-input">
                <Form.Item name="password">
                  <Input.Password
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                  />
                </Form.Item>
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <BiIcons.BiHide /> : <BiIcons.BiShow />}
                </button>
              </div>
            </div>
            <Form.Item>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </button>
            </Form.Item>
          </Form>
          <div className="google-login-container">
            <p className="divider">OR</p>
            <GoogleOAuthProvider clientId={config.googleClientId}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  toast.error('Google sign-up failed');
                }}
                useOneTap
                text="signup_with"
                theme="filled_black"
                size="large"
                width="100%"
                shape="rectangular"
              />
            </GoogleOAuthProvider>
          </div>
          <div className="switch-auth">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Register; 