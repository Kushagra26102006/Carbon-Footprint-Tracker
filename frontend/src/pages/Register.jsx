import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, UserPlus, AlertCircle } from 'lucide-react';

const Register = () => {
  const { register, loading, token } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
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

    // Input Validations
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setValidationError('Please fill out all required fields.');
      return;
    }

    if (name.length < 2) {
      setValidationError('Username must be at least 2 characters long.');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match. Please verify.');
      return;
    }

    try {
      const success = await register(name, email, password);
      if (success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setApiError(err.message || 'Registration failed. That account might already exist.');
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
          <h2>Join EcoTrack</h2>
          <p style={{ color: 'var(--slate-text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Start monitoring and minimizing your carbon emissions
          </p>
        </div>

        {/* Validation error popups */}
        {validationError && (
          <div className="alert-error">
            <AlertCircle size={18} />
            <span>{validationError}</span>
          </div>
        )}

        {/* API response error popups */}
        {apiError && (
          <div className="alert-error">
            <AlertCircle size={18} />
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Username / Name</label>
            <input
              id="name"
              type="text"
              placeholder="e.g. Green Saver"
              className="glass-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="e.g. mail@domain.com"
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
              placeholder="Min 6 characters"
              className="glass-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Re-enter password"
              className="glass-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1.5rem' }}>
            {loading ? (
              <div className="spinner" style={{ margin: '0', width: '20px', height: '20px' }}></div>
            ) : (
              <>
                <UserPlus size={18} />
                <span>Sign Up</span>
              </>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--slate-text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary-emerald)', textDecoration: 'none', fontWeight: '600' }}>
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
