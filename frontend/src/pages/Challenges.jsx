import { useState } from 'react';
import { Trophy, ShieldAlert, Award, Calendar, CheckCircle2, UserPlus, Star } from 'lucide-react';

const Challenges = () => {
  const [joinedChallenges, setJoinedChallenges] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [leaderboardTab, setLeaderboardTab] = useState('weekly');

  const challengesList = [
    {
      id: "ch_1",
      title: "No Car Week",
      description: "Keep transportation carbon emissions under 10 kg CO2e for 7 days by active cycling or walking.",
      category: "transportation",
      duration: "7 Days",
      points: 150
    },
    {
      id: "ch_2",
      title: "Plastic-Free Week",
      description: "Recycle all household municipal waste entries, keeping non-recycled waste counts under 2 kg.",
      category: "waste",
      duration: "7 Days",
      points: 120
    },
    {
      id: "ch_3",
      title: "Energy Saving Month",
      description: "Keep air conditioning and household heating usage under 10 logged hours for the month.",
      category: "energy",
      duration: "30 Days",
      points: 300
    },
    {
      id: "ch_4",
      title: "Plant-Powered Commute",
      description: "Log at least 5 vegan or vegetarian dietary servings to replace high-meat carbon scores.",
      category: "diet",
      duration: "14 Days",
      points: 200
    }
  ];

  const mockLeaderboard = {
    weekly: [
      { rank: 1, name: "Siddharth Sharma", carbonSaved: 142.5, badges: 4 },
      { rank: 2, name: "Anjali Gupta", carbonSaved: 120.3, badges: 3 },
      { rank: 3, name: "Kushagra Verma", carbonSaved: 95.8, badges: 2 },
      { rank: 4, name: "Priyanjali Sen", carbonSaved: 82.1, badges: 2 },
      { rank: 5, name: "Rohan Das", carbonSaved: 74.0, badges: 1 }
    ],
    monthly: [
      { rank: 1, name: "Anjali Gupta", carbonSaved: 480.2, badges: 5 },
      { rank: 2, name: "Siddharth Sharma", carbonSaved: 450.9, badges: 4 },
      { rank: 3, name: "Kushagra Verma", carbonSaved: 382.4, badges: 3 },
      { rank: 4, name: "Meera Nair", carbonSaved: 310.5, badges: 3 },
      { rank: 5, name: "Rahul Kapoor", carbonSaved: 290.1, badges: 2 }
    ]
  };

  const handleJoinChallenge = (id, title) => {
    if (joinedChallenges.includes(id)) {
      setJoinedChallenges(joinedChallenges.filter(ch => ch !== id));
      setSuccessMsg(`Left challenge: "${title}"`);
    } else {
      setJoinedChallenges([...joinedChallenges, id]);
      setSuccessMsg(`Successfully joined challenge: "${title}"! Good luck saving carbon.`);
    }
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="main-content">
      {/* PAGE HEADER */}
      <div className="page-header" style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Trophy style={{ color: 'var(--lime-accent)' }} />
          <span>Community Challenges & Leaderboards</span>
        </h1>
        <p style={{ color: 'var(--slate-text-muted)', marginTop: '0.5rem' }}>
          Engage in carbon reduction sprints and compete with other green warriors
        </p>
      </div>

      {successMsg && (
        <div className="alert-success">
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* DUAL VIEW GRID */}
      <div className="dashboard-grid">
        
        {/* LEFT COLUMN: ACTIVE CHALLENGES */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)' }}>Active Sprints</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {challengesList.map((ch) => (
              <div key={ch.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div style={{ flex: 1, minWidth: '250px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem' }}>{ch.title}</h3>
                    <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.04)', padding: '0.2rem 0.5rem', borderRadius: '4px', color: 'var(--slate-text-muted)' }}>
                      {ch.duration}
                    </span>
                  </div>
                  <p style={{ color: 'var(--slate-text-muted)', fontSize: '0.85rem', lineHeight: '1.5' }}>{ch.description}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--lime-accent)' }}>
                    <Star size={14} />
                    <span>Reward: {ch.points} Green Points</span>
                  </div>
                </div>
                <button
                  onClick={() => handleJoinChallenge(ch.id, ch.title)}
                  className="btn-primary"
                  style={{
                    width: 'auto',
                    background: joinedChallenges.includes(ch.id) ? 'rgba(244,63,94,0.1)' : undefined,
                    border: joinedChallenges.includes(ch.id) ? '1px solid var(--danger-rose)' : 'none',
                    color: joinedChallenges.includes(ch.id) ? 'var(--danger-rose)' : '#ffffff',
                    padding: '0.6rem 1.2rem',
                    fontSize: '0.9rem',
                    boxShadow: joinedChallenges.includes(ch.id) ? 'none' : undefined
                  }}
                >
                  {joinedChallenges.includes(ch.id) ? 'Leave Challenge' : 'Join Challenge'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: LEADERBOARDS */}
        <div className="glass-card" style={{ height: 'fit-content' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Trophy size={18} style={{ color: 'var(--lime-accent)' }} />
              <span>Leaderboard</span>
            </h2>
            
            {/* Toggles */}
            <div style={{ display: 'flex', gap: '0.25rem', background: 'rgba(0,0,0,0.2)', padding: '0.2rem', borderRadius: '6px' }}>
              <button 
                onClick={() => setLeaderboardTab('weekly')}
                style={{
                  background: leaderboardTab === 'weekly' ? 'var(--glass-surface)' : 'transparent',
                  color: leaderboardTab === 'weekly' ? '#ffffff' : 'var(--slate-text-muted)',
                  border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: '600'
                }}
              >
                Weekly
              </button>
              <button 
                onClick={() => setLeaderboardTab('monthly')}
                style={{
                  background: leaderboardTab === 'monthly' ? 'var(--glass-surface)' : 'transparent',
                  color: leaderboardTab === 'monthly' ? '#ffffff' : 'var(--slate-text-muted)',
                  border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: '600'
                }}
              >
                Monthly
              </button>
            </div>
          </div>

          <table className="leaderboard-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Rank</th>
                <th>User</th>
                <th style={{ textAlign: 'right' }}>Saved (kg)</th>
              </tr>
            </thead>
            <tbody>
              {mockLeaderboard[leaderboardTab].map((row, idx) => (
                <tr key={idx} className="leaderboard-row">
                  <td className={`leaderboard-rank rank-${row.rank}`}>{row.rank}</td>
                  <td>
                    <div className="leaderboard-user">
                      <span>{row.name}</span>
                      {row.badges > 3 && (
                        <span className="leaderboard-badge-count" title={`${row.badges} unlocked badges`}>
                          {row.badges}🏅
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: '700', fontFamily: 'var(--font-display)' }}>
                    {row.carbonSaved.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default Challenges;
