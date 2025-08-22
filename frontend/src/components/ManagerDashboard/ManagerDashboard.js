import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';
import ManagerNavi from '../ManagerNavi/ManagerNavi';
import './ManagerDashboard.css';

function ManagerDashboard() {
	const [active, setActive] = useState('overview');
	const [stats, setStats] = useState({
		totalInventory: 0,
		lowStock: 0,
		categories: 0,
		newItems: 0
	});
	const [categoryCounts, setCategoryCounts] = useState([]);
	const [lowStockItems, setLowStockItems] = useState([]);
	const salesChartRef = useRef(null);
	const stockChartRef = useRef(null);
	const salesChartInstance = useRef(null);
	const stockChartInstance = useRef(null);

	const navigateTo = (path) => {
		window.location.href = path;
	};

	const logout = () => {
		localStorage.clear();
		navigateTo('/Login');
	};

	const loadInventory = async () => {
		try {
			const res = await axios.get('http://localhost:8080/inventory');
			const items = Array.isArray(res.data) ? res.data : [];

			const catMap = {};
			items.forEach((it) => {
				const cat = it.itemCategory || 'Unknown';
				catMap[cat] = (catMap[cat] || 0) + 1;
			});
			const cats = Object.entries(catMap).map(([name, count]) => ({ name, count })).sort((a,b)=>b.count-a.count);

			const low = items
				.filter((it) => Number(it.itemQty || it.qty || 0) <= 10)
				.slice(0, 6);

			setStats({
				totalInventory: items.length,
				lowStock: low.length,
				categories: Object.keys(catMap).length,
				newItems: Math.min(8, Math.floor(items.length * 0.15))
			});
			setCategoryCounts(cats);
			setLowStockItems(low);
			createCharts(cats, items);
		} catch (e) {
			console.error('Failed to load inventory', e);
		}
	};

	useEffect(() => {
		loadInventory();
		return () => {
			if (salesChartInstance.current) { salesChartInstance.current.destroy(); salesChartInstance.current = null; }
			if (stockChartInstance.current) { stockChartInstance.current.destroy(); stockChartInstance.current = null; }
		};
	}, []);

	const createCharts = (cats, items) => {
		if (salesChartInstance.current) { salesChartInstance.current.destroy(); salesChartInstance.current = null; }
		if (stockChartInstance.current) { stockChartInstance.current.destroy(); stockChartInstance.current = null; }

		// Sales by Category (mocked by counts)
		if (salesChartRef.current) {
			const ctx = salesChartRef.current.getContext('2d');
			salesChartInstance.current = new Chart(ctx, {
				type: 'bar',
				data: {
					labels: cats.slice(0, 6).map(c => c.name),
					datasets: [{
						label: 'Items per Category',
						data: cats.slice(0, 6).map(c => c.count),
						backgroundColor: ['#ecfdf5','#d1fae5','#a7f3d0','#6ee7b7','#34d399','#10b981'],
						borderColor: '#34d399',
						borderWidth: 2,
						borderRadius: 8,
						borderSkipped: false
					}]
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: { legend: { display: false } },
					scales: {
						x: { grid: { display: false }, ticks: { color: '#6b7280' } },
						y: { beginAtZero: true, grid: { color: '#e5e7eb' }, ticks: { color: '#6b7280' } }
					}
				}
			});
		}

		// Stock trend (mocked monthly from total items)
		if (stockChartRef.current) {
			const ctx2 = stockChartRef.current.getContext('2d');
			const gradient = ctx2.createLinearGradient(0, 0, 0, 220);
			gradient.addColorStop(0, 'rgba(110,231,183,0.35)');
			gradient.addColorStop(1, 'rgba(52,211,153,0.12)');

			const base = items.length || 1;
			const dataPoints = Array.from({length: 12}, (_,i) => Math.max(0, Math.floor(base * (0.6 + Math.random()*0.6))));

			stockChartInstance.current = new Chart(ctx2, {
				type: 'line',
				data: {
					labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
					datasets: [{
						label: 'Inventory Trend',
						data: dataPoints,
						borderColor: '#10b981',
						backgroundColor: gradient,
						fill: true,
						borderWidth: 3,
						tension: 0.35,
						pointRadius: 5,
						pointBackgroundColor: '#10b981',
						pointBorderColor: '#fff',
						pointBorderWidth: 2
					}]
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: { legend: { display: false } },
					scales: {
						x: { grid: { display: false }, ticks: { color: '#6b7280' } },
						y: { grid: { color: '#e5e7eb' }, ticks: { color: '#6b7280' } }
					}
				}
			});
		}
	};

	return (
		<div className="manager-dashboard">
			<ManagerNavi active={active} setActive={setActive} navigateTo={navigateTo} logout={logout} />
			<main className="main-content">
				<div className="topbar">
					<div className="breadcrumbs">Manager / Dashboard</div>
					<div className="top-actions">
						<input className="top-search" type="text" placeholder="Search..." />
						<button className="top-btn" onClick={() => navigateTo('/additem')}>+ New Item</button>
						<div className="avatar" title="Manager">PM</div>
					</div>
				</div>

				<div className="dashboard-header">
					<h1>Product Manager Dashboard</h1>
					<p>Plan, track, and optimize inventory and products</p>
				</div>

				<div className="welcome-hero">
					<div className="welcome-content">
						<h1>Welcome back, Product Manager! 🧑‍💼</h1>
						<p>Here is a quick overview of your product operations</p>
						<div className="welcome-actions">
							<button className="welcome-btn primary" onClick={() => navigateTo('/allitems')}>📦 View Inventory</button>
							<button className="welcome-btn secondary" onClick={() => navigateTo('/additem')}>➕ Add Item</button>
						</div>
					</div>
					<div className="welcome-visual"><div className="welcome-icon">🥥</div></div>
				</div>

				<section className="stats-grid">
					<div className="stat-card">
						<div className="stat-icon">📦</div>
						<div className="stat-info">
							<div className="stat-number">{stats.totalInventory.toLocaleString()}</div>
							<div className="stat-label">Total Items</div>
						</div>
					</div>
					<div className="stat-card">
						<div className="stat-icon">⚠️</div>
						<div className="stat-info">
							<div className="stat-number">{stats.lowStock}</div>
							<div className="stat-label">Low Stock</div>
						</div>
					</div>
					<div className="stat-card">
						<div className="stat-icon">🗂️</div>
						<div className="stat-info">
							<div className="stat-number">{stats.categories}</div>
							<div className="stat-label">Categories</div>
						</div>
					</div>
					<div className="stat-card">
						<div className="stat-icon">✨</div>
						<div className="stat-info">
							<div className="stat-number">{stats.newItems}</div>
							<div className="stat-label">New Items</div>
						</div>
					</div>
				</section>

				<div className="dashboard-content">
					<div className="dashboard-card">
						<h3>Inventory</h3>
						<p>Review and update items in stock</p>
						<div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
							<button className="dashboard-btn" onClick={() => navigateTo('/allitems')}>All Items</button>
							<button className="dashboard-btn" onClick={() => navigateTo('/additem')}>Add Item</button>
						</div>
					</div>
					<div className="dashboard-card">
						<h3>Top Categories</h3>
						<p>Most represented categories in inventory</p>
						<div className="category-pills">
							{categoryCounts.slice(0,6).map((c,idx) => (
								<span key={idx} className="pill">{c.name} <b>{c.count}</b></span>
							))}
							{categoryCounts.length === 0 && <span className="pill">No data</span>}
						</div>
					</div>
					<div className="dashboard-card">
						<h3>Low Stock Alerts</h3>
						<p>Items at or below safe stock level</p>
						<ul className="low-stock-list">
							{lowStockItems.map((it, idx) => (
								<li key={idx}><span className="badge warn">Low</span> {it.itemName || it.itemname || 'Item'} — Qty: <b>{it.itemQty || it.qty}</b></li>
							))}
							{lowStockItems.length === 0 && <li>No low stock items</li>}
						</ul>
					</div>
				</div>

				<section className="panel-grid">
					<div className="panel">
						<div className="panel-header"><h3>Sales by Category</h3></div>
						<div className="chart-container"><canvas ref={salesChartRef}></canvas></div>
					</div>
					<div className="panel">
						<div className="panel-header"><h3>Inventory Trend</h3></div>
						<div className="chart-container"><canvas ref={stockChartRef}></canvas></div>
					</div>
				</section>
			</main>
		</div>
	);
}

export default ManagerDashboard; 