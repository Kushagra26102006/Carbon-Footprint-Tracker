import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, LayoutDashboard, PlusCircle, BarChart2, Lightbulb, User, LogOut, Menu, X, Trophy, Globe, Settings } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar-wrapper">
      <div className="navbar-content">
        {/* Project Branding Logo */}
        <Link to={user ? "/dashboard" : "/"} className="navbar-logo" onClick={() => setIsOpen(false)}>
          <Leaf className="logo-icon" size={24} />
          <span>Eco<span>Track</span></span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="navbar-links-desktop">
          <NavLink to="/dashboard" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/log" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <PlusCircle size={18} />
            <span>Log Activity</span>
          </NavLink>
          <NavLink to="/analytics" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <BarChart2 size={18} />
            <span>Reports</span>
          </NavLink>
          <NavLink to="/challenges" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Trophy size={18} />
            <span>Challenges</span>
          </NavLink>
          <NavLink to="/offsetting" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Globe size={18} />
            <span>Offsetting</span>
          </NavLink>
          <NavLink to="/recommendations" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Lightbulb size={18} />
            <span>AI Advice</span>
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <User size={18} />
            <span>Profile</span>
          </NavLink>
          {user?.role === 'admin' && (
            <NavLink to="/admin" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Settings size={18} />
              <span>Admin</span>
            </NavLink>
          )}
        </div>

        {/* User Context Info Actions */}
        <div className="navbar-user-actions">
          {user && (
            <div className="user-info-badge">
              <span className="user-name-text">Hello, {user.name}</span>
            </div>
          )}
          <button onClick={handleLogoutClick} className="btn-logout" title="Sign Out">
            <LogOut size={18} />
            <span className="logout-text">Logout</span>
          </button>
        </div>

        {/* Mobile Menu Toggle Icon */}
        <button className="mobile-toggle" onClick={toggleMobileMenu}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Overlay Links */}
      {isOpen && (
        <div className="navbar-links-mobile">
          <NavLink to="/dashboard" end className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/log" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
            <PlusCircle size={18} />
            <span>Log Activity</span>
          </NavLink>
          <NavLink to="/analytics" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
            <BarChart2 size={18} />
            <span>Reports</span>
          </NavLink>
          <NavLink to="/challenges" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
            <Trophy size={18} />
            <span>Challenges</span>
          </NavLink>
          <NavLink to="/offsetting" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
            <Globe size={18} />
            <span>Offsetting</span>
          </NavLink>
          <NavLink to="/recommendations" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
            <Lightbulb size={18} />
            <span>AI Advice</span>
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
            <User size={18} />
            <span>Profile</span>
          </NavLink>
          {user?.role === 'admin' && (
            <NavLink to="/admin" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
              <Settings size={18} />
              <span>Admin</span>
            </NavLink>
          )}
          <button onClick={() => { handleLogoutClick(); setIsOpen(false); }} className="mobile-logout-btn">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
