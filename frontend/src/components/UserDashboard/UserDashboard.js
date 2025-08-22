import React from 'react';


function UserDashboard() {
  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <h1>Buyer Dashboard</h1>
        <p>Welcome to your CocoLanka buyer dashboard</p>
      </div>
      
      <div className="dashboard-content">
        <div className="dashboard-card">
          <h3>My Orders</h3>
          <p>View and manage your orders</p>
          <button className="dashboard-btn">View Orders</button>
        </div>
        
        <div className="dashboard-card">
          <h3>Browse Products</h3>
          <p>Explore available coconut products</p>
          <button className="dashboard-btn">Browse Products</button>
        </div>
        
        <div className="dashboard-card">
          <h3>My Profile</h3>
          <p>Manage your account settings</p>
          <button className="dashboard-btn">Edit Profile</button>
        </div>
        
        <div className="dashboard-card">
          <h3>Contact Support</h3>
          <p>Get help with your orders</p>
          <button className="dashboard-btn">Contact Us</button>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard; 