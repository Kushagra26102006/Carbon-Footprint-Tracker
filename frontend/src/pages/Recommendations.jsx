import { useState, useEffect } from 'react';
import axios from 'axios';
import { Lightbulb, RefreshCw, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';

const Recommendations = () => {
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [source, setSource] = useState('cache');

 const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://carbon-footprint-tracker-wk54.onrender.com';

const fetchRecommendations = async (bypassCache = false) => {
  try {
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');

    const response = await axios.get(
      `${API_URL}/api/recommendations`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      setRecommendation(response.data.data.aiResponse);
      setSource(response.data.source || 'live');
    } else {
      setError(response.data.message || 'Failed to fetch recommendations');
    }
  } catch (err) {
    console.error('Recommendation Error:', err);

    setError(
      err.response?.data?.message ||
      'Could not connect to the recommendation engine.'
    );
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchRecommendations();
}, []);
  // Simple clean markdown parser to convert standard markdown tags into styled HTML elements
  const renderMarkdown = (mdText) => {
    if (!mdText) return null;

    const lines = mdText.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();

      // Heading 2 (##)
      if (trimmed.startsWith('## ')) {
        return <h2 key={idx} style={{ color: '#ffffff', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', margin: '1.5rem 0 1rem 0', fontFamily: 'var(--font-display)' }}>{trimmed.replace('## ', '')}</h2>;
      }
      // Heading 3 (###)
      if (trimmed.startsWith('### ')) {
        return <h3 key={idx} style={{ color: 'var(--lime-accent)', margin: '1.25rem 0 0.75rem 0', fontFamily: 'var(--font-display)' }}>{trimmed.replace('### ', '')}</h3>;
      }
      // Bullet list items (*)
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const text = trimmed.substring(2);
        return (
          <li key={idx} style={{ marginLeft: '1.5rem', marginBottom: '0.5rem', listStyleType: 'disc', color: 'var(--slate-text-main)' }}>
            {parseBoldText(text)}
          </li>
        );
      }
      // Numbered items (e.g. 1., 2.)
      if (/^\d+\.\s/.test(trimmed)) {
        const text = trimmed.replace(/^\d+\.\s/, '');
        return (
          <p key={idx} style={{ margin: '0.75rem 0', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
            <span style={{ color: 'var(--primary-emerald)', fontWeight: '700' }}>•</span>
            <span>{parseBoldText(text)}</span>
          </p>
        );
      }
      // Empty lines
      if (!trimmed) {
        return <div key={idx} style={{ height: '0.5rem' }}></div>;
      }

      // Default paragraphs
      return <p key={idx} style={{ margin: '0.75rem 0', lineHeight: '1.6', color: 'var(--slate-text-main)' }}>{parseBoldText(trimmed)}</p>;
    });
  };

  // Helper parsing **text** into bold tags
  const parseBoldText = (text) => {
    const parts = text.split('**');
    return parts.map((part, index) => {
      // Alternate indices represent content wrapped in **
      return index % 2 === 1 ? <strong key={index} style={{ color: '#ffffff', fontWeight: '600' }}>{part}</strong> : part;
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Consulting EcoGenius AI Sustainability Engine...</p>
      </div>
    );
  }

  return (
    <div className="main-content">
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Lightbulb size={28} style={{ color: 'var(--primary-emerald)' }} />
            <span>AI Green recommendations</span>
          </h1>
          <p style={{ color: 'var(--slate-text-muted)', marginTop: '0.5rem' }}>
            Personalized sustainability audits compiled dynamically by Google Gemini AI
          </p>
        </div>
        <button 
          onClick={() => fetchRecommendations(true)} 
          className="btn-primary" 
          style={{ width: 'auto', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', color: '#ffffff', boxShadow: 'none' }}
        >
          <RefreshCw size={16} />
          <span>Refresh Analysis</span>
        </button>
      </div>

      {error && (
        <div className="alert-error">
          <ShieldAlert size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* DYNAMIC AUDIT CONTENT CARD */}
      <div className="glass-card" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Glow vector effect */}
        <div style={{
          position: 'absolute',
          top: '-150px',
          right: '-150px',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}></div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-emerald)' }}>
            <Sparkles size={18} />
            <span style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>EcoGenius Audit Report</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--slate-text-muted)', background: 'rgba(255,255,255,0.04)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
            Source: {source === 'cache' ? 'Cached Analysis' : 'Live Generated'}
          </span>
        </div>

        <div className="recommendations-body" style={{ color: 'var(--slate-text-main)' }}>
          {renderMarkdown(recommendation)}
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
