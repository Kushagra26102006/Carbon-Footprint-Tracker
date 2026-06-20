import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { BarChart3, PieChart as PieIcon, HelpCircle, ShieldAlert } from 'lucide-react';

const Analytics = () => {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        const [logsRes, statsRes] = await Promise.all([
          axios.get('/api/logs'),
          axios.get('/api/logs/analytics')
        ]);

        if (logsRes.data.success) {
          setLogs(logsRes.data.data);
        }
        if (statsRes.data.success) {
          setStats(statsRes.data.data);
        }
      } catch (err) {
        setError('Failed to query logs histories to compile graphs summary.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  // Process data for category-wise Pie Chart
  const getPieChartData = () => {
    if (!stats) return [];
    const { byCategory } = stats;
    return [
      { name: 'Transportation', value: byCategory.transportation, color: '#60a5fa' },
      { name: 'Energy', value: byCategory.energy, color: '#fbbf24' },
      { name: 'Diet', value: byCategory.diet, color: '#34d399' },
      { name: 'Waste', value: byCategory.waste, color: '#a78bfa' }
    ].filter(item => item.value > 0); // Exclude zero values
  };

  // Process logs to group carbon footprint chronologically by date for Bar Chart (last 7 logs/days)
  const getBarChartData = () => {
    if (logs.length === 0) return [];
    
    // Group logs by date string
    const grouped = {};
    // Process logs in chronological order (reverse of sorted date array)
    [...logs].reverse().forEach(log => {
      const dateStr = new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      grouped[dateStr] = (grouped[dateStr] || 0) + log.calculatedCarbon;
    });

    // Map to list form and slice to last 7 days of entries
    return Object.keys(grouped).map(date => ({
      date,
      emissions: Math.round(grouped[date] * 100) / 100
    })).slice(-7);
  };

  const pieData = getPieChartData();
  const barData = getBarChartData();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Assembling charts and compiling reports...</p>
      </div>
    );
  }

  return (
    <div className="main-content">
      {/* HEADER */}
      <div className="page-header" style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontFamily: 'var(--font-display)' }}>Carbon Reports & Analytics</h1>
        <p style={{ color: 'var(--slate-text-muted)', marginTop: '0.5rem' }}>
          Deconstruct your emission sources and evaluate weekly usage profiles
        </p>
      </div>

      {error && (
        <div className="alert-error">
          <ShieldAlert size={18} />
          <span>{error}</span>
        </div>
      )}

      {logs.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--slate-text-muted)' }}>
          <HelpCircle size={48} style={{ color: 'var(--primary-emerald)', marginBottom: '1.5rem' }} />
          <h2>No Data Available</h2>
          <p style={{ marginTop: '0.5rem', maxWWidth: '450px', margin: '0.5rem auto' }}>
            We need logged activities to construct analytics graphs. Go to the log page to enter metrics.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* GRID: PLOTS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
            
            {/* Pie Chart Card */}
            <div className="glass-card" style={{ minHeight: '380px', display: 'flex', flexDirection: 'column' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <PieIcon size={20} style={{ color: 'var(--primary-emerald)' }} />
                <span>Emissions by Category</span>
              </h2>
              {pieData.length === 0 ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--slate-text-muted)' }}>
                  No category details recorded
                </div>
              ) : (
                <div style={{ flex: 1, minHeight: '250px', position: 'relative' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#ffffff' }}
                        formatter={(value) => [`${value.toFixed(2)} kg CO2e`]}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36} 
                        formatter={(value) => <span style={{ color: 'var(--slate-text-main)', fontSize: '0.85rem' }}>{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Bar Chart Card */}
            <div className="glass-card" style={{ minHeight: '380px', display: 'flex', flexDirection: 'column' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BarChart3 size={20} style={{ color: 'var(--lime-accent)' }} />
                <span>Daily Emissions Timeline (Last 7 Active Days)</span>
              </h2>
              {barData.length === 0 ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--slate-text-muted)' }}>
                  Insufficient daily logs data to construct timeline
                </div>
              ) : (
                <div style={{ flex: 1, minHeight: '250px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                      <XAxis dataKey="date" stroke="var(--slate-text-muted)" fontSize={11} tickLine={false} />
                      <YAxis stroke="var(--slate-text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#ffffff' }}
                        formatter={(value) => [`${value} kg CO2e`, 'Emissions']}
                      />
                      <Bar dataKey="emissions" fill="var(--primary-emerald)" radius={[4, 4, 0, 0]} maxBarSize={45}>
                        {barData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill="url(#emeraldGradient)" />
                        ))}
                      </Bar>
                      {/* Gradient definition block */}
                      <defs>
                        <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--primary-emerald)" stopOpacity={1} />
                          <stop offset="100%" stopColor="var(--primary-emerald)" stopOpacity={0.4} />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

          </div>

          {/* SUMMARY ANALYTICS PANEL */}
          <div className="glass-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', background: 'rgba(16, 185, 129, 0.03)', borderColor: 'rgba(16, 185, 129, 0.15)' }}>
            <div>
              <h3 style={{ fontSize: '0.85rem', color: 'var(--slate-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Logged Emission Footprint</h3>
              <p style={{ fontSize: '2rem', fontWeight: '800', color: '#ffffff', marginTop: '0.5rem', fontFamily: 'var(--font-display)' }}>
                {stats?.totalCarbon.toFixed(2)} <span style={{ fontSize: '1rem', fontWeight: '400', color: 'var(--slate-text-muted)' }}>kg CO2e</span>
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '0.85rem', color: 'var(--slate-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avg Emissions Per Activity</h3>
              <p style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary-emerald)', marginTop: '0.5rem', fontFamily: 'var(--font-display)' }}>
                {(stats?.totalCarbon / (stats?.logsCount || 1)).toFixed(2)} <span style={{ fontSize: '1rem', fontWeight: '400', color: 'var(--slate-text-muted)' }}>kg/log</span>
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '0.85rem', color: 'var(--slate-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Remaining Budget Margin</h3>
              <p style={{ fontSize: '2rem', fontWeight: '800', color: stats?.monthlyBudget - stats?.totalCarbon > 0 ? 'var(--lime-accent)' : 'var(--danger-rose)', marginTop: '0.5rem', fontFamily: 'var(--font-display)' }}>
                {(stats?.monthlyBudget - stats?.totalCarbon).toFixed(2)} <span style={{ fontSize: '1rem', fontWeight: '400', color: 'var(--slate-text-muted)' }}>kg CO2e</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
