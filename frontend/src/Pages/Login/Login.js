import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { loginAPI } from '../../utils/ApiRequest';
import * as BiIcons from 'react-icons/bi';
import AuthLayout from '../../components/AuthLayout';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import config from '../../config/config';
import { Form, Input } from 'antd';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('user')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (formValues) => {
    const { email, password } = formValues;
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(loginAPI, formValues);
      if (data.success) {
        toast.success('Login successful!');
        localStorage.setItem('user', JSON.stringify({ ...data.user, password: '' }));
        navigate('/dashboard');
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || 'Login failed');
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
      toast.success('Login successful');
      localStorage.setItem('user', JSON.stringify({ ...data.user, password: '' }));
      navigate('/dashboard');
    } catch (error) {
      console.error('Google login error:', error);
      toast.error(error.response?.data?.message || 'Google login failed');
    }
  };

  return (
    <AuthLayout>
      <div className="auth-container">
        <div className="auth-card">
          <div className="brand">
            <h1>Login</h1>
          </div>
          <Form
            name="login-form"
            initialValues={{ remember: true }}
            onFinish={handleSubmit}
          >
            <div className="form-group">
              <label>Email</label>
              <Form.Item 
                name="email"
                rules={[{ required: true, message: 'Please input your Email!' }]}
              >
                <Input
                  type="email"
                  placeholder="Enter your email"
                />
              </Form.Item>
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="password-input">
                <Form.Item 
                  name="password"
                  rules={[{ required: true, message: 'Please input your Password!' }]}
                >
                  <Input.Password
                    type={showPassword ? "text" : "password"} 
                    placeholder="Enter your password"
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
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </Form.Item>
          </Form>

          <div className="google-login-container">
            <p className="divider">OR</p>
            <GoogleOAuthProvider clientId={config.googleClientId}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  toast.error('Google login failed');
                }}
                useOneTap
                text="continue_with"
                theme="filled_black"
                size="large"
                width="100%"
                shape="rectangular"
              />
            </GoogleOAuthProvider>
          </div>

          <div className="switch-auth">
            Don't have an account? <Link to="/register">Register</Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login; 