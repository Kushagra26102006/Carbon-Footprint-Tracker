import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Flame, 
  Trash2, 
  Award, 
  Calendar, 
  Car, 
  Zap, 
  Utensils, 
  PlusCircle, 
  BadgeAlert,
  ArrowRight,
  TrendingDown
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  
  // Dashboard states
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({
    totalCarbon: 0,
    monthlyBudget: 500,
    byCategory: { transportation: 0, energy: 0, diet: 0, waste: 0 },
    logsCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch log history and analytics metrics
const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://carbon-footprint-tracker-wk54.onrender.com';

const fetchDashboardData = async () => {
  try {
    setLoading(true);

    const [logsRes, statsRes] = await Promise.all([
      axios.get(`${API_URL}/api/logs`),
      axios.get(`${API_URL}/api/logs/analytics`)
    ]);

      if (logsRes.data.success) {
        setLogs(logsRes.data.data);
      }
      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
    } catch (err) {
      setError('Could not establish connections to pull backend dashboard metrics.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Handle Log Deletion
  const handleDeleteLog = async (id) => {
    if (!window.confirm('Are you sure you want to delete this activity log?')) return;
    try {
      const response = await axios.delete(
  `${API_URL}/api/logs/${id}`
);
      if (response.data.success) {
        // Refresh local dashboard data
        fetchDashboardData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error occurred while deleting activity log.');
    }
  };

  // Format category icons
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'transportation':
        return <Car size={18} />;
      case 'energy':
        return <Zap size={18} />;
      case 'diet':
        return <Utensils size={18} />;
      case 'waste':
        return <Trash2 size={18} />;
      default:
        return <Calendar size={18} />;
    }
  };

  // Compute budget percentage
  const budgetPercentage = Math.min(
    Math.round((stats.totalCarbon / stats.monthlyBudget) * 100) || 0,
    100
  );

  // Set budget alert colors
  const getBudgetBarClass = () => {
    if (stats.totalCarbon > stats.monthlyBudget) return 'danger';
    if (stats.totalCarbon > stats.monthlyBudget * 0.75) return 'warning';
    return '';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Syncing carbon logging ledgers and statistics metrics...</p>
      </div>
    );
  }

  return (
    <div className="main-content">
      {/* PAGE HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontFamily: 'var(--font-display)' }}>Dashboard</h1>
          <p style={{ color: 'var(--slate-text-muted)', marginTop: '0.5rem' }}>
            Welcome back! Monitor your carbon limits and badges cabinet
          </p>
        </div>
        <Link to="/log" className="btn-primary" style={{ width: 'auto' }}>
          <PlusCircle size={18} />
          <span>Log New Activity</span>
        </Link>
      </div>

      {error && (
        <div className="alert-error">
          <BadgeAlert size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* STATS MATRIX SECTION */}
      <div className="stats-grid">
        <div className="glass-card stat-box">
          <div className="stat-icon-wrapper">
            <Flame size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalCarbon.toFixed(1)} kg</span>
            <span className="stat-label">Total Emissions</span>
          </div>
        </div>

        <div className="glass-card stat-box">
          <div className="stat-icon-wrapper">
            <TrendingDown size={24} style={{ color: 'var(--lime-accent)' }} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.monthlyBudget} kg</span>
            <span className="stat-label">Carbon Budget Target</span>
          </div>
        </div>

        <div className="glass-card stat-box">
          <div className="stat-icon-wrapper">
            <Calendar size={24} style={{ color: 'var(--primary-emerald)' }} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.logsCount}</span>
            <span className="stat-label">Activities Logged</span>
          </div>
        </div>
      </div>

      {/* DASHBOARD DETAILS GRID */}
      <div className="dashboard-grid">
        {/* LEFT COLUMN: BUDGET AND ACTIVITIES */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Carbon Budget Status Card */}
          <div className="glass-card">
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>Monthly Budget Tracker</span>
              <span style={{ fontSize: '0.9rem', color: stats.totalCarbon > stats.monthlyBudget ? 'var(--danger-rose)' : 'var(--lime-accent)' }}>
                {budgetPercentage}% Consumed
              </span>
            </h2>
            <div className="budget-meter-container">
              <div className="budget-bar-outer">
                <div 
                  className={`budget-bar-inner ${getBudgetBarClass()}`}
                  style={{ width: `${budgetPercentage}%` }}
                ></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--slate-text-muted)', marginTop: '0.5rem' }}>
                <span>{stats.totalCarbon.toFixed(1)} kg CO2e Used</span>
                <span>Limit: {stats.monthlyBudget} kg CO2e</span>
              </div>
            </div>
            {stats.totalCarbon > stats.monthlyBudget && (
              <p style={{ marginTop: '1rem', color: 'var(--danger-rose)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BadgeAlert size={16} />
                <span>Alert: You have exceeded your designated carbon budget targets. Reduce transit emissions!</span>
              </p>
            )}
          </div>

          {/* Activities List Card */}
          <div className="glass-card">
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Recent Activity Logs Ledger</span>
              <Link to="/analytics" style={{ fontSize: '0.85rem', color: 'var(--primary-emerald)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span>View Analytics</span>
                <ArrowRight size={14} />
              </Link>
            </h2>
            {logs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--slate-text-muted)' }}>
                <p>No activity has been logged yet.</p>
                <Link to="/log" style={{ color: 'var(--primary-emerald)', textDecoration: 'none', display: 'inline-block', marginTop: '0.5rem', fontWeight: '600' }}>
                  Record your first habit now
                </Link>
              </div>
            ) : (
              <div className="ledger-list">
                {logs.slice(0, 10).map((log) => (
                  <div key={log._id} className="ledger-item">
                    <div className="ledger-meta">
                      <div className={`ledger-category-icon category-${log.category}`}>
                        {getCategoryIcon(log.category)}
                      </div>
                      <div className="ledger-details">
                        <span className="ledger-title">{log.category}</span>
                        <span className="ledger-date">
                          {new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    <div className="ledger-carbon">
                      <span className="ledger-value">{log.calculatedCarbon.toFixed(2)} kg CO2e</span>
                      <button onClick={() => handleDeleteLog(log._id)} className="btn-delete" title="Delete Log">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: EARNED BADGES CABINET */}
        <div className="glass-card" style={{ height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={20} style={{ color: 'var(--lime-accent)' }} />
            <span>Badges Unlocked</span>
          </h2>
          {user?.badges?.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--slate-text-muted)' }}>
              <p style={{ fontSize: '0.85rem' }}>No achievements unlocked yet.</p>
              <p style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Log plant-based diets or green commuting choices to earn badges!</p>
            </div>
          ) : (
            <div className="badge-grid" style={{ gridTemplateColumns: '1fr' }}>
              {user?.badges?.map((badge, idx) => (
                <div key={idx} className="badge-card" style={{ flexDirection: 'row', textAlign: 'left', padding: '0.75rem', gap: '1rem', width: '100%' }}>
                  <div className="badge-icon-wrapper" style={{ padding: '0.5rem', background: 'rgba(132, 204, 22, 0.08)', borderRadius: '8px' }}>
                    <Award size={24} />
                  </div>
                  <div>
                    <div className="badge-title" style={{ fontSize: '0.9rem' }}>{badge.title}</div>
                    <div className="badge-desc" style={{ fontSize: '0.75rem', color: 'var(--slate-text-muted)', marginTop: '0.1rem' }}>
                      {badge.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
