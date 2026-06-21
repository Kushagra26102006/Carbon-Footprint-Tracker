import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { PlusCircle, Car, Zap, Utensils, Trash2, CheckCircle2, AlertCircle, ShoppingBag } from 'lucide-react';

const LogActivity = () => {
  const { reloadProfile } = useAuth();

  const [activeTab, setActiveTab] = useState('transportation');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [vehicleType, setVehicleType] = useState('petrol_car');
  const [distanceKm, setDistanceKm] = useState('');
  const [electricityKwh, setElectricityKwh] = useState('');
  const [gasCubicMeters, setGasCubicMeters] = useState('');
  const [acHours, setAcHours] = useState('');
  const [heaterHours, setHeaterHours] = useState('');
  const [mealType, setMealType] = useState('vegan');
  const [servings, setServings] = useState('');
  const [wasteKg, setWasteKg] = useState('');
  const [recycled, setRecycled] = useState(false);
  const [shoppingType, setShoppingType] = useState('clothes');
  const [itemsCount, setItemsCount] = useState('');

  const resetForm = () => {
    setDistanceKm('');
    setElectricityKwh('');
    setGasCubicMeters('');
    setAcHours('');
    setHeaterHours('');
    setServings('');
    setWasteKg('');
    setRecycled(false);
    setItemsCount('');
  };

  // ✅ FIX 1: Added missing handleTabChange that also clears messages
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSuccessMsg('');
    setErrorMsg('');
    resetForm();
  };

  // ✅ FIX 2: Properly closed try/catch block and moved JSX outside
  const handleLogSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    const payload = { category: activeTab, details: {} };

    try {
      if (activeTab === 'transportation') {
        const distance = parseFloat(distanceKm);
        if (isNaN(distance) || distance <= 0) {
          setErrorMsg('Please enter a valid positive distance in km.');
          return;
        }
        payload.details = { vehicleType, distanceKm: distance };
      }

      if (activeTab === 'energy') {
        const elec = electricityKwh ? parseFloat(electricityKwh) : 0;
        const gas = gasCubicMeters ? parseFloat(gasCubicMeters) : 0;
        const ac = acHours ? parseFloat(acHours) : 0;
        const heat = heaterHours ? parseFloat(heaterHours) : 0;

        if (elec === 0 && gas === 0 && ac === 0 && heat === 0) {
          setErrorMsg('Please enter electricity usage, gas, AC, or heater hours.');
          return;
        }
        if (elec < 0 || gas < 0 || ac < 0 || heat < 0) {
          setErrorMsg('Usage metrics cannot be negative values.');
          return;
        }
        payload.details = {
          electricityKwh: elec || undefined,
          gasCubicMeters: gas || undefined,
          acHours: ac || undefined,
          heaterHours: heat || undefined,
        };
      }

      if (activeTab === 'diet') {
        const count = parseInt(servings);
        if (isNaN(count) || count <= 0) {
          setErrorMsg('Please enter a valid positive servings count.');
          return;
        }
        payload.details = { mealType, servings: count };
      }

      if (activeTab === 'waste') {
        const weight = parseFloat(wasteKg);
        if (isNaN(weight) || weight <= 0) {
          setErrorMsg('Please specify waste weight in kg.');
          return;
        }
        payload.details = { wasteKg: weight, recycled };
      }

      if (activeTab === 'shopping') {
        const count = parseInt(itemsCount);
        if (isNaN(count) || count <= 0) {
          setErrorMsg('Please enter a valid positive items count.');
          return;
        }
        payload.details = { shoppingType, itemsCount: count };
      }

      setLoading(true);

      const API_URL = import.meta.env.VITE_API_URL || 'https://carbon-footprint-tracker-wk54.onrender.com';
      const token = localStorage.getItem('token');

      const response = await axios.post(`${API_URL}/api/logs`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setSuccessMsg(
          `Successfully logged activity. Footprint: ${response.data.data.calculatedCarbon} kg CO2e.`
        );
        resetForm();
        await reloadProfile();
      }
    } catch (err) {
      // ✅ FIX 3: Added catch block that was entirely missing
      setErrorMsg(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIX 4: JSX is now correctly the component's return value
  return (
    <div className="main-content">
      <div className="page-header" style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontFamily: 'var(--font-display)' }}>Log Daily Activity</h1>
        <p style={{ color: 'var(--slate-text-muted)', marginTop: '0.5rem' }}>
          Record your daily habits to compute emissions and earn achievement badges
        </p>
      </div>

      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--glass-border)',
          background: 'rgba(0, 0, 0, 0.15)',
          flexWrap: 'wrap'
        }}>
          {[
            { key: 'transportation', label: 'Transportation', Icon: Car },
            { key: 'energy', label: 'Utilities/Energy', Icon: Zap },
            { key: 'diet', label: 'Diet', Icon: Utensils },
            { key: 'waste', label: 'Waste', Icon: Trash2 },
            { key: 'shopping', label: 'Shopping', Icon: ShoppingBag },
          ].map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => handleTabChange(key)}
              style={{
                flex: 1,
                minWidth: '120px',
                padding: '1.25rem 0.5rem',
                background: activeTab === key ? 'var(--glass-surface)' : 'transparent',
                color: activeTab === key ? '#ffffff' : 'var(--slate-text-muted)',
                border: 'none',
                borderBottom: activeTab === key ? '2px solid var(--primary-emerald)' : 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontWeight: '600',
                fontFamily: 'var(--font-display)',
                transition: 'var(--transition-smooth)'
              }}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        <div style={{ padding: '2.5rem' }}>
          {successMsg && (
            <div className="alert-success">
              <CheckCircle2 size={18} />
              <span>{successMsg}</span>
            </div>
          )}
          {errorMsg && (
            <div className="alert-error">
              <AlertCircle size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogSubmit}>
            {activeTab === 'transportation' && (
              <div>
                <div className="form-group">
                  <label htmlFor="vehicleType">Vehicle Alternative Type</label>
                  <select id="vehicleType" className="glass-input" value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} disabled={loading}>
                    <option value="petrol_car">Petrol Sedan / Car</option>
                    <option value="diesel_car">Diesel Sedan / Car</option>
                    <option value="hybrid_car">Hybrid Vehicle</option>
                    <option value="electric_car">Electric Vehicle (EV)</option>
                    <option value="bus">Public Bus Transit</option>
                    <option value="train">Metro / Local Train</option>
                    <option value="flight">Aviation / Airplane Flight</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="distanceKm">Travel Distance (in km)</label>
                  <input id="distanceKm" type="number" step="any" placeholder="e.g. 15.5" className="glass-input" value={distanceKm} onChange={(e) => setDistanceKm(e.target.value)} disabled={loading} required />
                </div>
              </div>
            )}

            {activeTab === 'energy' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                  <div className="form-group">
                    <label htmlFor="electricityKwh">Grid Electricity (kWh)</label>
                    <input id="electricityKwh" type="number" step="any" placeholder="e.g. 120" className="glass-input" value={electricityKwh} onChange={(e) => setElectricityKwh(e.target.value)} disabled={loading} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="gasCubicMeters">Natural Gas (m³)</label>
                    <input id="gasCubicMeters" type="number" step="any" placeholder="e.g. 5" className="glass-input" value={gasCubicMeters} onChange={(e) => setGasCubicMeters(e.target.value)} disabled={loading} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
                  <div className="form-group">
                    <label htmlFor="acHours">Air Conditioner Usage (Hours)</label>
                    <input id="acHours" type="number" step="any" placeholder="e.g. 6" className="glass-input" value={acHours} onChange={(e) => setAcHours(e.target.value)} disabled={loading} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="heaterHours">Space Heater Usage (Hours)</label>
                    <input id="heaterHours" type="number" step="any" placeholder="e.g. 4" className="glass-input" value={heaterHours} onChange={(e) => setHeaterHours(e.target.value)} disabled={loading} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'diet' && (
              <div>
                <div className="form-group">
                  <label htmlFor="mealType">Meal Classification Type</label>
                  <select id="mealType" className="glass-input" value={mealType} onChange={(e) => setMealType(e.target.value)} disabled={loading}>
                    <option value="vegan">Vegan (Entirely Plant-Based)</option>
                    <option value="vegetarian">Vegetarian (No meat, dairy/eggs included)</option>
                    <option value="pescatarian">Pescatarian (Fish allowed, no other meat)</option>
                    <option value="low_meat">Low Meat (Poultry/Pork occasionally)</option>
                    <option value="high_meat">High Meat (Frequent Beef/Lamb/Red meat)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="servings">Servings Count</label>
                  <input id="servings" type="number" placeholder="e.g. 2" className="glass-input" value={servings} onChange={(e) => setServings(e.target.value)} disabled={loading} required />
                </div>
              </div>
            )}

            {activeTab === 'waste' && (
              <div>
                <div className="form-group">
                  <label htmlFor="wasteKg">Waste Output Weight (in kg)</label>
                  <input id="wasteKg" type="number" step="any" placeholder="e.g. 4.5" className="glass-input" value={wasteKg} onChange={(e) => setWasteKg(e.target.value)} disabled={loading} required />
                </div>
                <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.75rem', marginTop: '1rem' }}>
                  <input id="recycled" type="checkbox" checked={recycled} onChange={(e) => setRecycled(e.target.checked)} disabled={loading} style={{ width: '18px', height: '18px', accentColor: 'var(--primary-emerald)', cursor: 'pointer' }} />
                  <label htmlFor="recycled" style={{ cursor: 'pointer', userSelect: 'none' }}>
                    Materials were recycled (reduces waste carbon footprint score by 70%)
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'shopping' && (
              <div>
                <div className="form-group">
                  <label htmlFor="shoppingType">Purchase Category</label>
                  <select id="shoppingType" className="glass-input" value={shoppingType} onChange={(e) => setShoppingType(e.target.value)} disabled={loading}>
                    <option value="clothes">Clothing / Apparel</option>
                    <option value="electronics">Electronics (Phones, Laptops, Gadgets)</option>
                    <option value="household">Household Items (Furniture, Appliances)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="itemsCount">Number of Items Purchased</label>
                  <input id="itemsCount" type="number" placeholder="e.g. 2" className="glass-input" value={itemsCount} onChange={(e) => setItemsCount(e.target.value)} disabled={loading} required />
                </div>
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '2rem', maxWidth: '250px' }}>
              {loading ? (
                <div className="spinner" style={{ margin: '0', width: '20px', height: '20px' }}></div>
              ) : (
                <>
                  <PlusCircle size={18} />
                  <span>Log Footprint</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LogActivity;
