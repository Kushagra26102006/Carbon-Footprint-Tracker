import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, LogIn, AlertCircle } from 'lucide-react';

const Login = () => {
  const { login, loading, token } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const [apiError, setApiError] = useState('');

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    setApiError('');

    // Input Validation checks
    if (!email.trim() || !password) {
      setValidationError('Please enter both email and password.');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters long.');
      return;
    }

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setApiError(err.message || 'Login credentials incorrect. Please try again.');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="glass-card auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <Leaf className="logo-icon" size={32} />
            <span>Eco<span>Track</span></span>
          </div>
          <h2>Welcome Back</h2>
          <p style={{ color: 'var(--slate-text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Log in to continue monitoring your green impact
          </p>
        </div>

        {/* Validation Errors alert box */}
        {validationError && (
          <div className="alert-error">
            <AlertCircle size={18} />
            <span>{validationError}</span>
          </div>
        )}

        {/* API Response errors alert box */}
        {apiError && (
          <div className="alert-error">
            <AlertCircle size={18} />
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="e.g. yourname@domain.com"
              className="glass-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="glass-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1.5rem' }}>
            {loading ? (
              <div className="spinner" style={{ margin: '0', width: '20px', height: '20px' }}></div>
            ) : (
              <>
                <LogIn size={18} />
                <span>Log In</span>
              </>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--slate-text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary-emerald)', textDecoration: 'none', fontWeight: '600' }}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
