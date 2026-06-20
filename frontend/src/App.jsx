import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Page Views
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LogActivity from './pages/LogActivity';
import Analytics from './pages/Analytics';
import Challenges from './pages/Challenges';
import Offsetting from './pages/Offsetting';
import Recommendations from './pages/Recommendations';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';

/**
 * Inner Application Router wrapper.
 * Places a global glassmorphic Navbar across all secure private routes.
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Carbon Tracking Routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <div className="app-container">
              <Navbar />
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/log" element={<LogActivity />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/challenges" element={<Challenges />} />
                <Route path="/offsetting" element={<Offsetting />} />
                <Route path="/recommendations" element={<Recommendations />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<AdminPanel />} />
                
                {/* Fallback redirect redirects back to Dashboard */}
                <Route path="*" element={<Dashboard />} />
              </Routes>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;
