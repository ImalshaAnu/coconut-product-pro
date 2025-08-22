import React, { useState, useEffect, useRef } from 'react';
import Navi from '../Navi/navi';
import UserDetails from '../Userdetails/UserDetails';
import UserProfile from '../UserProfile/UserProfile';
import Chart from 'chart.js/auto';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './Admindashborad.css';

function AdminDashboard() {
  const [active, setActive] = useState('overview');
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    totalInventory: 0,
    ordersToday: 0,
    revenue: 0
  });
  const [userRoleStats, setUserRoleStats] = useState({
    admin: 0,
    buyer: 0,
    product_manager: 0
  });
  const [categoryStats, setCategoryStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const chartRef = useRef(null);
  const lineChartInstance = useRef(null);

  const navigateTo = (path) => {
    window.location.href = path;
  };

  const logout = () => {
    localStorage.clear();
    navigateTo('/Login');
  };

  // Fetch dashboard statistics from backend
  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch users
      const usersResponse = await axios.get('http://localhost:8080/user');
      const users = usersResponse.data;
      
      // Fetch inventory
      const inventoryResponse = await axios.get('http://localhost:8080/inventory');
      const inventory = inventoryResponse.data;
      
      // Calculate user role distribution
      const roleCounts = {
        admin: 0,
        buyer: 0,
        product_manager: 0
      };
      
      users.forEach(user => {
        const role = (user.roll || '').toLowerCase();
        if (role === 'admin') roleCounts.admin++;
        else if (role === 'buyer') roleCounts.buyer++;
        else if (role === 'product_manager') roleCounts.product_manager++;
      });
      
      // Calculate category distribution
      const categoryCounts = {};
      inventory.forEach(item => {
        const category = item.itemCategory || 'Unknown';
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });
      
      const sortedCategories = Object.entries(categoryCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 4); // Top 4 categories
      
      setDashboardStats({
        totalUsers: users.length,
        totalInventory: inventory.length,
        ordersToday: Math.floor(Math.random() * 50) + 30, // Placeholder - replace with real orders API
        revenue: Math.floor(Math.random() * 5000) + 8000 // Placeholder - replace with real revenue API
      });
      
      setUserRoleStats(roleCounts);
      setCategoryStats(sortedCategories);
      
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch current user information
  const fetchCurrentUser = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (userId) {
        const response = await axios.get(`http://localhost:8080/user/${userId}`);
        setCurrentUser(response.data);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  // Generate PDF for Reports page
  const generateReportsPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(24);
      doc.setTextColor(52, 211, 153); // Green color
      doc.text('CocoLanka - Analytics & Reports', 20, 30);
      
      // Add generation date
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
      
      // Add executive summary
      doc.setFontSize(18);
      doc.setTextColor(52, 211, 153);
      doc.text('Executive Summary', 20, 65);
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Total Users: ${dashboardStats.totalUsers.toLocaleString()}`, 20, 80);
      doc.text(`Total Inventory Items: ${dashboardStats.totalInventory.toLocaleString()}`, 20, 90);
      doc.text(`Orders Today: ${dashboardStats.ordersToday.toLocaleString()}`, 20, 100);
      doc.text(`Revenue This Month: $${dashboardStats.revenue.toLocaleString()}`, 20, 110);
      
      // Add user role distribution table
      doc.setFontSize(16);
      doc.setTextColor(52, 211, 153);
      doc.text('User Role Distribution', 20, 135);
      
      const roleData = [
        ['Admin', userRoleStats.admin, `${dashboardStats.totalUsers > 0 ? Math.round((userRoleStats.admin / dashboardStats.totalUsers) * 100) : 0}%`],
        ['Buyer', userRoleStats.buyer, `${dashboardStats.totalUsers > 0 ? Math.round((userRoleStats.buyer / dashboardStats.totalUsers) * 100) : 0}%`],
        ['Product Manager', userRoleStats.product_manager, `${dashboardStats.totalUsers > 0 ? Math.round((userRoleStats.product_manager / dashboardStats.totalUsers) * 100) : 0}%`]
      ];
      
      autoTable(doc, {
        startY: 145,
        head: [['Role', 'Count', 'Percentage']],
        body: roleData,
        theme: 'grid',
        headStyles: {
          fillColor: [52, 211, 153],
          textColor: [255, 255, 255],
          fontSize: 12
        },
        bodyStyles: {
          fontSize: 10
        },
        margin: { left: 20 }
      });
      
      // Add category distribution table
      doc.setFontSize(16);
      doc.setTextColor(52, 211, 153);
      doc.text('Top Categories Distribution', 20, doc.lastAutoTable.finalY + 20);
      
      const categoryData = categoryStats.map(category => [
        category.name,
        category.count,
        `${Math.round((category.count / dashboardStats.totalInventory) * 100)}%`
      ]);
      
      if (categoryData.length === 0) {
        categoryData.push(['No categories', 0, '0%']);
      }
      
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 30,
        head: [['Category', 'Count', 'Percentage']],
        body: categoryData,
        theme: 'grid',
        headStyles: {
          fillColor: [52, 211, 153],
          textColor: [255, 255, 255],
          fontSize: 12
        },
        bodyStyles: {
          fontSize: 10
        },
        margin: { left: 20 }
      });
      
      // Add growth trends section
      doc.setFontSize(16);
      doc.setTextColor(52, 211, 153);
      doc.text('Growth Trends', 20, doc.lastAutoTable.finalY + 20);
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('• User Growth: +12% from last month', 20, doc.lastAutoTable.finalY + 35);
      doc.text('• Inventory Growth: +8% from last month', 20, doc.lastAutoTable.finalY + 45);
      doc.text('• Order Growth: +15% from yesterday', 20, doc.lastAutoTable.finalY + 55);
      doc.text('• Revenue Growth: +23% from last month', 20, doc.lastAutoTable.finalY + 65);
      
      // Add footer
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('CocoLanka Admin Dashboard - Analytics & Reports', 20, doc.internal.pageSize.height - 20);
      
      // Save the PDF
      doc.save('cocolanka-analytics-report.pdf');
      
      // Show success message
      alert('PDF generated successfully!');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  useEffect(() => {
    fetchDashboardStats();
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;

    if (!(active === 'overview' || active === 'reports')) {
      // If we are not on a tab that displays the chart, make sure it's destroyed
      if (lineChartInstance.current) {
        lineChartInstance.current.destroy();
        lineChartInstance.current = null;
      }
      return;
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Destroy existing chart instance if present
    if (lineChartInstance.current) {
      lineChartInstance.current.destroy();
      lineChartInstance.current = null;
    }

    // Create gradient for the chart
    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
    gradient.addColorStop(0, 'rgba(110, 231, 183, 0.3)');
    gradient.addColorStop(1, 'rgba(52, 211, 153, 0.1)');

    // Generate realistic data based on actual user count
    const baseUsers = Number(dashboardStats.totalUsers) || 0;
    let monthlyData = [];
    if (baseUsers > 0) {
      let remaining = baseUsers;
      for (let i = 0; i < 12; i++) {
        const portion = Math.max(0, Math.floor((remaining / (12 - i)) * (0.6 + Math.random() * 0.8)));
        monthlyData.push(portion);
        remaining = Math.max(0, remaining - portion);
      }
    } else {
      // Seed small values so the chart still renders when totalUsers is 0
      monthlyData = Array.from({ length: 12 }, () => Math.floor(Math.random() * 5) + 1);
    }

    const data = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'User Registrations',
        data: monthlyData,
        borderColor: '#34d399',
        backgroundColor: gradient,
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#34d399',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      }]
    };

    const config = {
      type: 'line',
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#ffffff',
            titleColor: '#064e3b',
            bodyColor: '#065f46',
            borderColor: '#d1fae5',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: false
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#6b7280' }
          },
          y: {
            grid: { color: '#e5e7eb' },
            ticks: { color: '#6b7280' }
          }
        },
        elements: {
          point: { hoverBackgroundColor: '#34d399' }
        }
      }
    };

    // Create and store instance
    lineChartInstance.current = new Chart(ctx, config);

    // Cleanup
    return () => {
      if (lineChartInstance.current) {
        lineChartInstance.current.destroy();
        lineChartInstance.current = null;
      }
    };
  }, [active, dashboardStats.totalUsers]);

  return (
    <div className="admin-dashboard">
      <Navi active={active} setActive={setActive} navigateTo={navigateTo} logout={logout} />

      <main className="main-content">
        <div className="topbar">
          <div className="breadcrumbs">Admin / Dashboard</div>
          <div className="top-actions">
            <input className="top-search" type="text" placeholder="Search in dashboard..." />
            <button className="top-btn" onClick={() => navigateTo('/additem')}>+ New Item</button>
            <div className="avatar" title="Admin">A</div>
          </div>
        </div>

        {active === 'overview' && (
          <>
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>System administration and management</p>
      </div>

            <div className="welcome-hero">
              <div className="welcome-content">
                <h1>
                  Welcome back, {currentUser?.fullname ? currentUser.fullname : 'Admin'}! 👋
                </h1>
                <p>Here's what's happening with your CocoLanka system today</p>
                <div className="welcome-actions">
                  <button className="welcome-btn primary" onClick={() => setActive('reports')}>
                    📊 View Reports
                  </button>
                  <button className="welcome-btn secondary" onClick={() => setActive('users')}>
                    👥 Manage Users
                  </button>
                </div>
              </div>
              <div className="welcome-visual">
                <div className="welcome-icon">🥥</div>
              </div>
            </div>

            <section className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <div className="stat-number">{dashboardStats.totalUsers.toLocaleString()}</div>
                  <div className="stat-label">Total Users</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📦</div>
                <div className="stat-info">
                  <div className="stat-number">{dashboardStats.totalInventory.toLocaleString()}</div>
                  <div className="stat-label">Items in Stock</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🛒</div>
                <div className="stat-info">
                  <div className="stat-number">{dashboardStats.ordersToday.toLocaleString()}</div>
                  <div className="stat-label">Orders Today</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⚠️</div>
                <div className="stat-info">
                  <div className="stat-number">5</div>
                  <div className="stat-label">Low Stock Alerts</div>
                </div>
              </div>
            </section>
      
      <div className="dashboard-content">
        <div className="dashboard-card">
          <h3>User Management</h3>
          <p>Manage user accounts and permissions</p>
                <button className="dashboard-btn" onClick={() => setActive('users')}>Manage Users</button>
        </div>
        
        <div className="dashboard-card">
          <h3>System Settings</h3>
          <p>Configure system parameters</p>
                <button className="dashboard-btn" onClick={() => setActive('settings')}>System Settings</button>
        </div>
        
        <div className="dashboard-card">
          <h3>Analytics & Reports</h3>
          <p>View system analytics and reports</p>
                <button className="dashboard-btn" onClick={() => setActive('reports')}>View Reports</button>
        </div>
        
        <div className="dashboard-card">
                <h3>Inventory</h3>
                <p>Review and update items in inventory</p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button className="dashboard-btn" onClick={() => navigateTo('/allitems')}>All Items</button>
                  <button className="dashboard-btn" onClick={() => navigateTo('/additem')}>Add Item</button>
                </div>
              </div>
            </div>

            <section className="panel-grid">
              <div className="panel">
                <div className="panel-header">
                  <h3>Recent Activity</h3>
                  <button className="link-btn" onClick={() => setActive('reports')}>View all</button>
                </div>
                <ul className="activity-list">
                  <li><span>✅</span> New user registered: john@doe.com</li>
                  <li><span>✏️</span> Item "Coconut Oil 1L" updated</li>
                  <li><span>⚠️</span> Low stock: Coir Ropes</li>
                  <li><span>🗑️</span> Item "Vintage Shell Bowl" deleted</li>
                </ul>
              </div>
              <div className="panel">
                <div className="panel-header">
                  <h3>Quick Actions</h3>
                </div>
                <div className="quick-actions">
                  <button className="qa-btn" onClick={() => navigateTo('/additem')}>➕ Add New Item</button>
                  <button className="qa-btn" onClick={() => navigateTo('/allitems')}>📦 View Inventory</button>
                  <button className="qa-btn" onClick={() => setActive('users')}>👥 Manage Users</button>
                  <button className="qa-btn" onClick={() => setActive('settings')}>⚙️ Settings</button>
                </div>
              </div>
            </section>

            <div className="chart-section">
              <div className="chart-header">
                <h3>User Growth Trends</h3>
                <p>Monthly user registration statistics</p>
              </div>
              <div className="chart-container">
                <canvas ref={chartRef}></canvas>
              </div>
            </div>
          </>
        )}

        {active === 'users' && (
          <>
            <div className="dashboard-header">
              <h1>User Management</h1>
              <p>View and manage all registered users</p>
            </div>
            <UserDetails />
          </>
        )}

        {active === 'reports' && (
          <>
            <div className="dashboard-header">
              <h1>Analytics & Reports</h1>
              <p>Comprehensive system statistics and insights</p>
              <div className="reports-header-actions">
                <button 
                  className="refresh-dashboard-btn" 
                  onClick={fetchDashboardStats}
                  disabled={loading}
                >
                  {loading ? '🔄 Refreshing...' : '🔄 Refresh Data'}
                </button>
                <button 
                  className="pdf-export-btn" 
                  onClick={generateReportsPDF}
                  disabled={loading}
                >
                  📄 Export PDF Report
                </button>
              </div>
            </div>

            <section className="reports-stats">
              <div className="report-stat-card primary">
                <div className="stat-icon-large">👥</div>
                <div className="stat-content">
                  <div className="stat-number-large">{dashboardStats.totalUsers.toLocaleString()}</div>
                  <div className="stat-label-large">Total Users</div>
                  <div className="stat-change positive">+12% from last month</div>
                </div>
              </div>
              
              <div className="report-stat-card">
                <div className="stat-icon-large">📦</div>
                <div className="stat-content">
                  <div className="stat-number-large">{dashboardStats.totalInventory.toLocaleString()}</div>
                  <div className="stat-label-large">Inventory Items</div>
                  <div className="stat-change positive">+8% from last month</div>
                </div>
              </div>
              
              <div className="report-stat-card">
                <div className="stat-icon-large">🛒</div>
                <div className="stat-content">
                  <div className="stat-number-large">{dashboardStats.ordersToday.toLocaleString()}</div>
                  <div className="stat-label-large">Orders Today</div>
                  <div className="stat-change positive">+15% from yesterday</div>
                </div>
              </div>
              
              <div className="report-stat-card">
                <div className="stat-icon-large">💰</div>
                <div className="stat-content">
                  <div className="stat-number-large">${dashboardStats.revenue.toLocaleString()}</div>
                  <div className="stat-label-large">Revenue This Month</div>
                  <div className="stat-change positive">+23% from last month</div>
                </div>
              </div>
            </section>

            <div className="reports-grid">
              <div className="report-card wide">
                <div className="report-card-header">
                  <h3>User Growth Analytics</h3>
                  <div className="report-actions">
                    <select className="report-period" defaultValue="30">
                      <option value="7">Last 7 days</option>
                      <option value="30">Last 30 days</option>
                      <option value="90">Last 3 months</option>
                      <option value="365">Last year</option>
                    </select>
                    <button className="export-btn">📊 Export</button>
                  </div>
                </div>
                <div className="chart-container-large">
                  <canvas ref={chartRef}></canvas>
                </div>
              </div>

              <div className="report-card">
                <div className="report-card-header">
                  <h3>User Role Distribution</h3>
                </div>
                <div className="role-distribution">
                  <div className="role-item">
                    <div className="role-color admin"></div>
                    <div className="role-info">
                      <span className="role-name">Admin</span>
                      <span className="role-count">{userRoleStats.admin} users</span>
                    </div>
                    <div className="role-percentage">
                      {dashboardStats.totalUsers > 0 ? Math.round((userRoleStats.admin / dashboardStats.totalUsers) * 100) : 0}%
                    </div>
                  </div>
                  <div className="role-item">
                    <div className="role-color buyer"></div>
                    <div className="role-info">
                      <span className="role-name">Buyer</span>
                      <span className="role-count">{userRoleStats.buyer} users</span>
                    </div>
                    <div className="role-percentage">
                      {dashboardStats.totalUsers > 0 ? Math.round((userRoleStats.buyer / dashboardStats.totalUsers) * 100) : 0}%
                    </div>
                  </div>
                  <div className="role-item">
                    <div className="role-color manager"></div>
                    <div className="role-info">
                      <span className="role-name">Product Manager</span>
                      <span className="role-count">{userRoleStats.product_manager} users</span>
                    </div>
                    <div className="role-percentage">
                      {dashboardStats.totalUsers > 0 ? Math.round((userRoleStats.product_manager / dashboardStats.totalUsers) * 100) : 0}%
                    </div>
                  </div>
                </div>
              </div>

              <div className="report-card">
                <div className="report-card-header">
                  <h3>Top Categories</h3>
                </div>
                <div className="category-stats">
                  {categoryStats.map((category, index) => (
                    <div key={index} className="category-item">
                      <div className="category-icon">
                        {category.name === 'OIL' ? '🥥' : 
                         category.name === 'COIR' ? '🪢' : 
                         category.name === 'HANDICRAFT' ? '🎨' : 
                         category.name === 'FOOD' ? '🌾' : '📦'}
                      </div>
                      <div className="category-info">
                        <span className="category-name">{category.name}</span>
                        <span className="category-count">{category.count} items</span>
                      </div>
                      <div className="category-percentage">
                        {dashboardStats.totalInventory > 0 ? Math.round((category.count / dashboardStats.totalInventory) * 100) : 0}%
                      </div>
                    </div>
                  ))}
                  {categoryStats.length === 0 && (
                    <div className="category-item">
                      <div className="category-icon">📦</div>
                      <div className="category-info">
                        <span className="category-name">No categories</span>
                        <span className="category-count">0 items</span>
                      </div>
                      <div className="category-percentage">0%</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="report-card">
                <div className="report-card-header">
                  <h3>Recent Activity</h3>
                  <button className="view-all-btn">View All</button>
                </div>
                <div className="activity-timeline">
                  <div className="timeline-item">
                    <div className="timeline-icon new-user">👤</div>
                    <div className="timeline-content">
                      <div className="timeline-title">New user registered</div>
                      <div className="timeline-desc">john.doe@email.com</div>
                      <div className="timeline-time">2 hours ago</div>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-icon update">✏️</div>
                    <div className="timeline-content">
                      <div className="timeline-title">Item updated</div>
                      <div className="timeline-desc">Coconut Oil 1L</div>
                      <div className="timeline-time">4 hours ago</div>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-icon alert">⚠️</div>
                    <div className="timeline-content">
                      <div className="timeline-title">Low stock alert</div>
                      <div className="timeline-desc">Coir Ropes</div>
                      <div className="timeline-time">6 hours ago</div>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-icon delete">🗑️</div>
                    <div className="timeline-content">
                      <div className="timeline-title">Item deleted</div>
                      <div className="timeline-desc">Vintage Shell Bowl</div>
                      <div className="timeline-time">1 day ago</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="reports-actions">
              <button className="dashboard-btn" onClick={() => setActive('overview')}>
                ← Back to Overview
              </button>
              <button className="dashboard-btn outline" onClick={generateReportsPDF}>
                📊 Generate Full Report
              </button>
            </div>
          </>
        )}

        {active === 'profile' && (
          <UserProfile />
        )}

        {active === 'settings' && (
          <div className="dashboard-content">
            <div className="dashboard-card">
              <h3>Settings</h3>
              <p>Adjust system configurations and preferences.</p>
              <button className="dashboard-btn" onClick={() => setActive('overview')}>Back to Overview</button>
        </div>
      </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
