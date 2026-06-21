import { useState, useEffect } from 'react';
import axios from 'axios';
import { Globe, Heart, Trees, AlertCircle, Compass, ArrowUpRight } from 'lucide-react';

const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://carbon-footprint-tracker-wk54.onrender.com';

useEffect(() => {
  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token');

      const response = await axios.get(
        `${API_URL}/api/logs/analytics`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      console.error('Offset Analytics Error:', err);

      setError(
        err.response?.data?.message ||
        'Failed to pull statistics for offset configurations.'
      );
    } finally {
      setLoading(false);
    }
  };

  fetchStats();
}, []);
  // Compute offset equivalents
  const treesNeeded = Math.ceil(stats.totalCarbon / 22) || 0; // A tree absorbs ~22kg of CO2 per year
  const offsetCostDollars = (stats.totalCarbon / 1000) * 15; // Average $15 per ton of CO2 offset

  const projectsList = [
    {
      title: "Reforestation Project in Western Ghats",
      description: "Support local planting of native trees in the Western Ghats region to restore biodiversity and create native carbon sinks.",
      type: "Forestry & Biodiversity",
      impact: "22 kg CO2 per tree/year",
      price: "$1.50 per seedling"
    },
    {
      title: "Community Solar Power Grid Expansion",
      description: "Contribute to clean energy access for rural villages, replacing inefficient diesel power generators with microgrid solar batteries.",
      type: "Renewable Energy",
      impact: "0.45 kg CO2 offset per kWh generated",
      price: "$10.00 per share"
    },
    {
      title: "Clean Stoves Initiative",
      description: "Provide clean-burning cooking stoves to households in developing areas, minimizing indoor biomass smoke and local soot emissions.",
      type: "Community Cookstoves",
      impact: "Approx 1.5 tons CO2 offset per stove/year",
      price: "$25.00 per stove"
    }
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Calculating carbon offset recommendations...</p>
      </div>
    );
  }

  return (
    <div className="main-content">
      {/* HEADER */}
      <div className="page-header" style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Globe style={{ color: 'var(--primary-emerald)' }} />
          <span>Carbon Offsetting & Clean Projects</span>
        </h1>
        <p style={{ color: 'var(--slate-text-muted)', marginTop: '0.5rem' }}>
          Restore balance by planting trees and backing verified renewable carbon reduction projects
        </p>
      </div>

      {error && (
        <div className="alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* DUAL COLUMN METRICS PANELS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        
        {/* Equivalency Calculator Card */}
        <div className="glass-card" style={{ background: 'rgba(16, 185, 129, 0.03)', borderColor: 'rgba(16, 185, 129, 0.15)' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Trees style={{ color: 'var(--primary-emerald)' }} />
            <span>Your Personal Offset Target</span>
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--slate-text-muted)', lineHeight: '1.5', marginBottom: '1.5rem' }}>
            Based on your accumulated carbon log history of **{stats.totalCarbon.toFixed(1)} kg CO2e**, here is the ecological footprint equivalent required to neutralize your impact:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(0,0,0,0.15)', borderRadius: '10px', border: '1px solid var(--glass-border)' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Mature Trees to Grow (for 1 year)</span>
              <span style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--lime-accent)', fontFamily: 'var(--font-display)' }}>
                {treesNeeded} {treesNeeded === 1 ? 'Tree' : 'Trees'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(0,0,0,0.15)', borderRadius: '10px', border: '1px solid var(--glass-border)' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Equivalent Offset Investment</span>
              <span style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary-emerald)', fontFamily: 'var(--font-display)' }}>
                ${offsetCostDollars.toFixed(2)} USD
              </span>
            </div>
          </div>
        </div>

        {/* Informative tips card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Heart style={{ color: 'var(--danger-rose)' }} />
            <span>Why Offset?</span>
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--slate-text-muted)', lineHeight: '1.6' }}>
            Carbon offsetting is a transition mechanism. While the primary goal of EcoTrack is to guide you to **reduce** direct emissions (like commuting and electricity consumption), neutralizing remaining footprints through tree planting and renewable microgrids helps balance the atmospheric carbon load.
          </p>
        </div>

      </div>

      {/* CLOUD PROJECTS SCHEMES LIST */}
      <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', fontFamily: 'var(--font-display)' }}>Verified Reforestation & Energy Projects</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {projectsList.map((project, idx) => (
          <div key={idx} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ flex: 1, minWidth: '250px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--primary-emerald)', background: 'rgba(16,185,129,0.08)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(16,185,129,0.15)', fontWeight: '600' }}>
                  {project.type}
                </span>
                <h3 style={{ fontSize: '1.15rem' }}>{project.title}</h3>
              </div>
              <p style={{ color: 'var(--slate-text-muted)', fontSize: '0.85rem', lineHeight: '1.5' }}>{project.description}</p>
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--slate-text-muted)' }}>
                <span>Impact: <strong style={{ color: '#ffffff' }}>{project.impact}</strong></span>
                <span>Unit Cost: <strong style={{ color: '#ffffff' }}>{project.price}</strong></span>
              </div>
            </div>
            <a 
              href="https://www.goldstandard.org/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-secondary"
              style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', width: 'auto' }}
            >
              <span>Explore Project</span>
              <ArrowUpRight size={14} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Offsetting;
