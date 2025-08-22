import React from 'react';
import './ManagerNavi.css';

function ManagerNavi({ active, setActive, navigateTo, logout }) {
	return (
		<aside className="pm-sidebar">
			<div className="pm-brand">
				<div className="pm-logo">🥥</div>
				<div className="pm-title">
					<span className="pm-name">CocoLanka</span>
					<span className="pm-role">Product Manager</span>
				</div>
			</div>

			<div className="pm-search">
				<input type="text" placeholder="Search..." />
			</div>

			<nav className="pm-nav">
				<div className={`pm-item ${active === 'overview' ? 'active' : ''}`} onClick={() => setActive('overview')}>
					<span className="pm-icon">📊</span>
					<span className="pm-text">Overview</span>
				</div>
				<div className="pm-item" onClick={() => navigateTo('/allitems')}>
					<span className="pm-icon">📦</span>
					<span className="pm-text">Inventory</span>
				</div>
				<div className="pm-item" onClick={() => navigateTo('/additem')}>
					<span className="pm-icon">➕</span>
					<span className="pm-text">Add Item</span>
				</div>
				<div className={`pm-item ${active === 'analytics' ? 'active' : ''}`} onClick={() => setActive('analytics')}>
					<span className="pm-icon">📈</span>
					<span className="pm-text">Analytics</span>
				</div>
				<div className={`pm-item ${active === 'lowstock' ? 'active' : ''}`} onClick={() => setActive('lowstock')}>
					<span className="pm-icon">⚠️</span>
					<span className="pm-text">Low Stock</span>
				</div>
				<div className={`pm-item ${active === 'profile' ? 'active' : ''}`} onClick={() => setActive('profile')}>
					<span className="pm-icon">👤</span>
					<span className="pm-text">Profile</span>
				</div>
			</nav>

			<div className="pm-footer">
				<button className="pm-help">❓ Help</button>
				<button className="pm-logout" onClick={logout}>⎋ Logout</button>
			</div>
		</aside>
	);
}

export default ManagerNavi;
