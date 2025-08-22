import React from 'react';
import './navi.css';

function Navi({ active, setActive, navigateTo, logout }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-logo">🥥</span>
        <div className="brand-text">
          <span className="brand-name">CocoLanka</span>
          <span className="brand-sub">Admin</span>
        </div>
      </div>

      <div className="search-box">
        <input type="text" placeholder="Search..." />
      </div>

      <nav className="nav">
        <div className="nav-item" onClick={() => setActive('overview')}>
          <span className="nav-icon">📊</span>
          <span className="nav-text">Overview</span>
        </div>
        <div className="nav-item" onClick={() => setActive('users')}>
          <span className="nav-icon">👥</span>
          <span className="nav-text">Users</span>
        </div>
        <div className="nav-item" onClick={() => setActive('inventory')}>
          <span className="nav-icon">📦</span>
          <span className="nav-text">Inventory</span>
        </div>
        <div className="nav-item" onClick={() => setActive('reports')}>
          <span className="nav-icon">📈</span>
          <span className="nav-text">Reports</span>
        </div>
        <div className="nav-item" onClick={() => setActive('profile')}>
          <span className="nav-icon">👤</span>
          <span className="nav-text">Profile</span>
        </div>
      </nav>

      <div className="sidebar-footer">
        <button className="help-btn" onClick={() => setActive('help')}>
          <span className="nav-icon">❓</span>
          <span className="nav-label">Help & Support</span>
        </button>
        <button className="logout-btn" onClick={logout}>
          <span className="nav-icon">⏏️</span>
          <span className="nav-label">Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Navi;



