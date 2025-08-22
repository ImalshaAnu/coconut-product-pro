import React, { useEffect, useMemo, useState, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './UserDetails.css';

function UserDetails() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    roleDistribution: {},
    monthlyRegistrations: [],
    activeUsers: 0
  });
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const barChartInstance = useRef(null);
  const pieChartInstance = useRef(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get('http://localhost:8080/user');
      const usersData = Array.isArray(res.data) ? res.data : [];
      setUsers(usersData);
      
      // Calculate user statistics
      calculateUserStats(usersData);
    } catch (e) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const handleDeleteUser = async (id) => {
    try {
      setDeletingId(id);
      await axios.delete(`http://localhost:8080/user/${id}`);
      const updated = users.filter((u) => u.id !== id);
      setUsers(updated);
      calculateUserStats(updated);
      alert('User deleted successfully.');
    } catch (e) {
      console.error('Delete failed', e);
      alert('Failed to delete user. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    await handleDeleteUser(userToDelete.id);
    closeDeleteModal();
  };

  const calculateUserStats = (usersData) => {
    const roleCounts = {};
    const monthlyData = new Array(12).fill(0);
    
    usersData.forEach(user => {
      // Count roles
      const role = (user.roll || 'Unknown').toLowerCase();
      roleCounts[role] = (roleCounts[role] || 0) + 1;
      
      // Count monthly registrations (simulate based on user ID for demo)
      // In real app, you'd use actual registration dates
      const monthIndex = Math.floor(Math.random() * 12);
      monthlyData[monthIndex]++;
    });

    setUserStats({
      totalUsers: usersData.length,
      roleDistribution: roleCounts,
      monthlyRegistrations: monthlyData,
      activeUsers: Math.floor(usersData.length * 0.85) // 85% active users
    });
  };

  // Generate PDF for Users page
  const generateUsersPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.setTextColor(52, 211, 153); // Green color
      doc.text('CocoLanka - User Management Report', 20, 30);
      
      // Add generation date
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
      
      // Add summary statistics
      doc.setFontSize(16);
      doc.setTextColor(52, 211, 153);
      doc.text('Summary Statistics', 20, 65);
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Total Users: ${userStats.totalUsers}`, 20, 80);
      doc.text(`Active Users: ${userStats.activeUsers}`, 20, 90);
      doc.text(`New This Month: ${userStats.monthlyRegistrations[userStats.monthlyRegistrations.length - 1] || 0}`, 20, 100);
      
      // Add role distribution
      doc.setFontSize(14);
      doc.setTextColor(52, 211, 153);
      doc.text('User Role Distribution', 20, 120);
      
      const roleData = Object.entries(userStats.roleDistribution).map(([role, count]) => [
        role.charAt(0).toUpperCase() + role.slice(1),
        count,
        `${((count / userStats.totalUsers) * 100).toFixed(1)}%`
      ]);
      
      autoTable(doc, {
        startY: 130,
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
      
      // Add user table
      doc.setFontSize(14);
      doc.setTextColor(52, 211, 153);
      doc.text('User Details', 20, doc.lastAutoTable.finalY + 20);
      
      const userTableData = filtered.map(user => [
        user.id,
        user.fullname || 'N/A',
        user.email || 'N/A',
        user.phone || user.Phone || 'N/A',
        user.roll || 'N/A'
      ]);
      
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 30,
        head: [['ID', 'Name', 'Email', 'Phone', 'Role']],
        body: userTableData,
        theme: 'grid',
        headStyles: {
          fillColor: [52, 211, 153],
          textColor: [255, 255, 255],
          fontSize: 10
        },
        bodyStyles: {
          fontSize: 8
        },
        margin: { left: 20 },
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: 40 },
          2: { cellWidth: 50 },
          3: { cellWidth: 30 },
          4: { cellWidth: 25 }
        }
      });
      
      // Add footer
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('CocoLanka Admin Dashboard - User Management Report', 20, doc.internal.pageSize.height - 20);
      
      // Save the PDF
      doc.save('cocolanka-users-report.pdf');
      
      // Show success message
      alert('PDF generated successfully!');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (users.length > 0 && barChartRef.current && pieChartRef.current) {
      createCharts();
    }
    
    // Cleanup function to destroy charts when component unmounts
    return () => {
      if (barChartInstance.current) {
        barChartInstance.current.destroy();
        barChartInstance.current = null;
      }
      if (pieChartInstance.current) {
        pieChartInstance.current.destroy();
        pieChartInstance.current = null;
      }
    };
  }, [users]);

  const createCharts = () => {
    // Destroy existing charts first
    if (barChartInstance.current) {
      barChartInstance.current.destroy();
      barChartInstance.current = null;
    }
    if (pieChartInstance.current) {
      pieChartInstance.current.destroy();
      pieChartInstance.current = null;
    }

    // Create Bar Chart for Monthly User Registrations
    const barCtx = barChartRef.current.getContext('2d');
    barChartInstance.current = new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'User Registrations',
          data: userStats.monthlyRegistrations,
          backgroundColor: [
            '#ecfdf5', '#d1fae5', '#a7f3d0', '#6ee7b7', '#34d399', '#10b981',
            '#059669', '#047857', '#065f46', '#064e3b', '#022c22', '#011a15'
          ],
          borderColor: '#34d399',
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Monthly User Registrations',
            color: '#064e3b',
            font: {
              size: 16,
              weight: 'bold'
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: '#e5e7eb'
            },
            ticks: {
              color: '#6b7280'
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#6b7280'
            }
          }
        }
      }
    });

    // Create Pie Chart for Role Distribution
    const pieCtx = pieChartRef.current.getContext('2d');
    const roleLabels = Object.keys(userStats.roleDistribution);
    const roleData = Object.values(userStats.roleDistribution);
    const roleColors = ['#34d399', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];
    
    pieChartInstance.current = new Chart(pieCtx, {
      type: 'pie',
      data: {
        labels: roleLabels.map(role => role.charAt(0).toUpperCase() + role.slice(1)),
        datasets: [{
          data: roleData,
          backgroundColor: roleColors.slice(0, roleLabels.length),
          borderColor: '#ffffff',
          borderWidth: 3,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#064e3b',
              font: {
                size: 12,
                weight: '600'
              },
              padding: 20,
              usePointStyle: true
            }
          },
          title: {
            display: true,
            text: 'User Role Distribution',
            color: '#064e3b',
            font: {
              size: 16,
              weight: 'bold'
            },
            padding: {
              bottom: 20
            }
          }
        }
      }
    });
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      String(u.fullname || '').toLowerCase().includes(q) ||
      String(u.email || '').toLowerCase().includes(q) ||
      String(u.roll || '').toLowerCase().includes(q) ||
      String(u.phone || u.Phone || '').toLowerCase().includes(q)
    );
  }, [users, query]);

  return (
    <div className="users-container">
      <div className="users-wrap">
        <div className="users-header">
          <h2>All Users</h2>
          <div className="users-actions">
            <input
              className="users-search"
              type="text"
              placeholder="Search name, email, role, phone..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="refresh-btn" onClick={loadUsers} disabled={loading}>
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
            <button className="pdf-export-btn" onClick={generateUsersPDF} disabled={loading}>
              📄 Export PDF
            </button>
          </div>
        </div>

        {error && <div className="users-error">{error}</div>}

        <div className="users-table-wrap">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-cell">
                    {loading ? 'Loading users...' : 'No users found'}
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.fullname}</td>
                    <td>{u.email}</td>
                    <td>{u.phone || u.Phone || '-'}</td>
                    <td>
                      <span className={`role-badge role-${String(u.roll || '').toLowerCase().replace(/\s+/g, '-')}`}>
                        {u.roll || '-'}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button
                        className="delete-btn"
                        onClick={() => openDeleteModal(u)}
                        disabled={deletingId === u.id}
                        title="Delete user"
                      >
                        {deletingId === u.id ? 'Deleting...' : '🗑️ Delete'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Statistics Section */}
      <div className="users-stats-section">
        <div className="stats-overview">
          <div className="stat-item">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-number">{userStats.totalUsers}</div>
              <div className="stat-label">Total Users</div>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-number">{userStats.activeUsers}</div>
              <div className="stat-label">Active Users</div>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">🆕</div>
            <div className="stat-content">
              <div className="stat-number">{userStats.monthlyRegistrations[userStats.monthlyRegistrations.length - 1] || 0}</div>
              <div className="stat-label">This Month</div>
            </div>
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <div className="chart-container">
              {loading ? (
                <div className="chart-loading">
                  <div className="loading-spinner"></div>
                  <p>Loading chart data...</p>
                </div>
              ) : (
                <canvas ref={barChartRef}></canvas>
              )}
            </div>
          </div>
          <div className="chart-card">
            <div className="chart-container">
              {loading ? (
                <div className="chart-loading">
                  <div className="loading-spinner"></div>
                  <p>Loading chart data...</p>
                </div>
              ) : (
                <canvas ref={pieChartRef}></canvas>
              )}
            </div>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="modal-overlay" onClick={closeDeleteModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="delete-title">
            <button className="modal-close" onClick={closeDeleteModal} aria-label="Close">×</button>
            <div className="modal-icon-wrap">
              <div className="modal-icon-circle">✖</div>
            </div>
            <h3 id="delete-title" className="modal-title">Are you sure?</h3>
            <p className="modal-text">Do you really want to delete these records? This process cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn cancel" onClick={closeDeleteModal}>Cancel</button>
              <button className="btn delete" onClick={confirmDelete} disabled={deletingId === userToDelete?.id}>
                {deletingId === userToDelete?.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDetails;



