import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Award, CheckCircle2, AlertCircle, Save } from 'lucide-react';

const Profile = () => {
  const { user, updateBudget } = useAuth();
  
  // Budget states
  const [budgetVal, setBudgetVal] = useState(user?.monthlyBudget || 500);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleBudgetSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    const parsedBudget = parseFloat(budgetVal);
    if (isNaN(parsedBudget) || parsedBudget <= 0) {
      setErrorMsg('Please specify a valid carbon budget greater than 0 kg CO2e.');
      return;
    }

    try {
      setLoading(true);
      await updateBudget(parsedBudget);
      setSuccessMsg('Monthly carbon budget goal updated successfully!');
    } catch (err) {
      setErrorMsg(err.message || 'Could not write updated budget setting to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      {/* PAGE HEADER */}
      <div className="page-header" style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontFamily: 'var(--font-display)' }}>Profile Settings</h1>
        <p style={{ color: 'var(--slate-text-muted)', marginTop: '0.5rem' }}>
          Manage your account configurations, sustainability target limits, and achievements
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', alignItems: 'flex-start' }}>
        
        {/* LEFT COLUMN: PROFILE CARD AND BUDGET ADJUSTER */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* User Details card */}
          <div className="glass-card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid var(--glass-border)',
              color: 'var(--primary-emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <User size={36} />
            </div>
            <h2 style={{ fontSize: '1.25rem' }}>{user?.name}</h2>
            <p style={{ color: 'var(--slate-text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{user?.email}</p>
            <span style={{
              marginTop: '1rem',
              fontSize: '0.75rem',
              background: 'rgba(255, 255, 255, 0.04)',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              color: 'var(--slate-text-muted)'
            }}>
              Role: {user?.role || 'User'}
            </span>
          </div>

          {/* Budget updater card */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', fontFamily: 'var(--font-display)' }}>Change Monthly Goal</h3>
            
            {successMsg && (
              <div className="alert-success" style={{ padding: '0.6rem 1rem', fontSize: '0.85rem' }}>
                <CheckCircle2 size={16} />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="alert-error" style={{ padding: '0.6rem 1rem', fontSize: '0.85rem' }}>
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleBudgetSubmit}>
              <div className="form-group">
                <label htmlFor="budget">Carbon Target Limit (kg CO2e)</label>
                <input
                  id="budget"
                  type="number"
                  placeholder="e.g. 500"
                  className="glass-input"
                  value={budgetVal}
                  onChange={(e) => setBudgetVal(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '0.5rem' }}>
                {loading ? (
                  <div className="spinner" style={{ margin: '0', width: '20px', height: '20px' }}></div>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Save Budget Target</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: BADGES CABINET LIST */}
        <div className="glass-card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={20} style={{ color: 'var(--lime-accent)' }} />
            <span>Badges & Achievements cabinet</span>
          </h2>
          {user?.badges?.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--slate-text-muted)' }}>
              <p>Your badges cabinet is empty.</p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                Earn achievements by logging sustainable activities (e.g. EV commuting, vegetarian diets, waste recycling).
              </p>
            </div>
          ) : (
            <div className="badge-grid">
              {user?.badges?.map((badge, idx) => (
                <div key={idx} className="badge-card">
                  <div className="badge-icon-wrapper" style={{ padding: '0.75rem', background: 'rgba(132, 204, 22, 0.08)', borderRadius: '50%', marginBottom: '0.25rem' }}>
                    <Award size={28} />
                  </div>
                  <span className="badge-title">{badge.title}</span>
                  <span className="badge-desc">{badge.description}</span>
                  <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.15)', marginTop: '0.5rem' }}>
                    Unlocked {new Date(badge.unlockedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;
