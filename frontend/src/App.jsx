import React, { useState } from 'react';
import axios from 'axios';
import { User, Mail, Lock, Phone, ArrowRight, Github } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const endpoint = isLogin ? '/login' : '/register';
      const response = await axios.post(`${API_URL}${endpoint}`, formData);

      setMessage({ type: 'success', text: response.data.message });

      if (isLogin) {
        // Redirect to the Netflix landing page (movie app)
        setTimeout(() => {
          window.location.href = '/index.html';
        }, 1500);
      } else {
        // Switch to login after successful registration
        setTimeout(() => {
          setIsLogin(true);
          setFormData({ username: '', email: '', password: '', phone: '' });
        }, 2000);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Something went wrong. Please try again.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="background-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <div className="glass-container">
        <h1>{isLogin ? 'Welcome Back' : 'Join StreamX'}</h1>
        <p className="subtitle">
          {isLogin
            ? 'Sign in to access your streaming world'
            : 'Register for the ultimate streaming experience'}
        </p>

        {message.text && (
          <div className={message.type === 'error' ? 'error-msg' : 'success-msg'}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="form-group">
                <label>Email Address</label>
                <div className="input-wrapper">
                  <Mail size={18} />
                  <input
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <div className="input-wrapper">
                  <Phone size={18} />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+1 234 567 890"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label>Username</label>
            <div className="input-wrapper">
              <User size={18} />
              <input
                type="text"
                name="username"
                placeholder="johndoe"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock size={18} />
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <p className="toggle-text">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <span className="toggle-link" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign Up' : 'Log In'}
          </span>
        </p>
      </div>
    </>
  );
}

export default App;
