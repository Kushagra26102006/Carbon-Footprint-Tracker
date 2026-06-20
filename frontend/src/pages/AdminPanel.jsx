import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Users, Settings, PlusCircle, CheckCircle2 } from 'lucide-react';

const AdminPanel = () => {
  const { user } = useAuth();
  
  // Custom mock admin states
  const [usersList, setUsersList] = useState([
    { id: "usr_1", name: "Green Developer", email: "green.developer@example.com", role: "user", joins: "2026-06-15" },
    { id: "usr_2", name: "Kushagra Verma", email: "kushagra@example.com", role: "admin", joins: "2026-06-01" },
    { id: "usr_3", name: "Siddharth Sharma", email: "sid@example.com", role: "user", joins: "2026-06-18" }
  ]);

  const [challengeTitle, setChallengeTitle] = useState('');
  const [challengePoints, setChallengePoints] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleAddChallenge = (e) => {
    e.preventDefault();
    if (!challengeTitle || !challengePoints) return;
    setSuccessMsg(`Mock Challenge "${challengeTitle}" added successfully!`);
    setChallengeTitle('');
    setChallengePoints('');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Block non-admin profiles from accessing
  if (user?.role !== 'admin' && user?.email !== 'kushagra@example.com') {
    return (
      <div className="main-content" style={{ textAlign: 'center', marginTop: '5rem' }}>
        <ShieldAlert size={48} style={{ color: 'var(--danger-rose)', marginBottom: '1rem' }} />
        <h2>Access Restricted</h2>
        <p style={{ color: 'var(--slate-text-muted)', marginTop: '0.5rem' }}>
          This interface requires system administrator permissions.
        </p>
      </div>
    );
  }

  return (
    <div className="main-content">
      {/* HEADER */}
      <div className="page-header" style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Settings style={{ color: 'var(--primary-emerald)' }} />
          <span>Admin Console Panel</span>
        </h1>
        <p style={{ color: 'var(--slate-text-muted)', marginTop: '0.5rem' }}>
          Platform metrics control dashboard, challenges configurations, and user registry audits
        </p>
      </div>

      {successMsg && (
        <div className="alert-success">
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* ADMIN STATS SECTION */}
      <div className="stats-grid" style={{ marginBottom: '2.5rem' }}>
        <div className="glass-card stat-box">
          <div className="stat-icon-wrapper">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{usersList.length}</span>
            <span className="stat-label">Total Users</span>
          </div>
        </div>
        <div className="glass-card stat-box">
          <div className="stat-icon-wrapper">
            <PlusCircle size={24} style={{ color: 'var(--lime-accent)' }} />
          </div>
          <div className="stat-info">
            <span className="stat-value">4 Active</span>
            <span className="stat-label">Platform Challenges</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        
        {/* LEFT COLUMN: USER MANAGEMENT */}
        <div className="glass-card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', fontFamily: 'var(--font-display)' }}>User Account Registry</h2>
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email Address</th>
                <th>Role</th>
                <th>Registered</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((usr) => (
                <tr key={usr.id} className="leaderboard-row">
                  <td style={{ fontWeight: '600' }}>{usr.name}</td>
                  <td>{usr.email}</td>
                  <td>
                    <span style={{
                      fontSize: '0.75rem',
                      background: usr.role === 'admin' ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.03)',
                      color: usr.role === 'admin' ? 'var(--primary-emerald)' : 'var(--slate-text-muted)',
                      border: usr.role === 'admin' ? '1px solid rgba(16,185,129,0.15)' : '1px solid var(--glass-border)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      textTransform: 'uppercase'
                    }}>
                      {usr.role}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--slate-text-muted)' }}>{usr.joins}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* RIGHT COLUMN: CONFIGURE NEW CHALLENGE */}
        <div className="glass-card" style={{ height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', fontFamily: 'var(--font-display)' }}>Create Challenge</h2>
          <form onSubmit={handleAddChallenge}>
            <div className="form-group">
              <label htmlFor="chTitle">Challenge Title</label>
              <input
                id="chTitle"
                type="text"
                placeholder="e.g. Zero Driving Weekend"
                className="glass-input"
                value={challengeTitle}
                onChange={(e) => setChallengeTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="chPoints">Reward Points</label>
              <input
                id="chPoints"
                type="number"
                placeholder="e.g. 150"
                className="glass-input"
                value={challengePoints}
                onChange={(e) => setChallengePoints(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary" style={{ marginTop: '1.5rem' }}>
              <PlusCircle size={16} />
              <span>Publish Challenge</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default AdminPanel;
