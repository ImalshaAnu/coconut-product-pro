import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserProfile.css';

function UserProfile() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullname: '',
    email: '',
    phone: '',
    roll: ''
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get user ID from localStorage (set during login)
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        setError('User not logged in');
        setLoading(false);
        return;
      }

      const response = await axios.get(`http://localhost:8080/user/${userId}`);
      setUserProfile(response.data);
      
      // Initialize edit form with current values
      setEditForm({
        fullname: response.data.fullname || '',
        email: response.data.email || '',
        phone: response.data.phone || response.data.Phone || '',
        roll: response.data.roll || ''
      });
      
    } catch (err) {
      console.error('Error loading user profile:', err);
      setError('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      // Reset form to current values when starting to edit
      setEditForm({
        fullname: userProfile.fullname || '',
        email: userProfile.email || '',
        phone: userProfile.phone || userProfile.Phone || '',
        roll: userProfile.roll || ''
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      
      const userId = localStorage.getItem('userId');
      const updateData = {
        fullname: editForm.fullname,
        email: editForm.email,
        phone: editForm.phone,
        roll: editForm.roll
      };

      // Call the backend API to update the user profile
      const response = await axios.put(`http://localhost:8080/user/${userId}`, updateData);
      
      // Update local state with the response from backend
      setUserProfile(response.data);
      setIsEditing(false);
      
      alert('Profile updated successfully!');
      
    } catch (err) {
      console.error('Error updating profile:', err);
      if (err.response?.status === 404) {
        alert('User not found. Please try logging in again.');
      } else {
        alert('Failed to update profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form to current values
    setEditForm({
      fullname: userProfile.fullname || '',
      email: userProfile.email || '',
      phone: userProfile.phone || userProfile.Phone || '',
      roll: userProfile.roll || ''
    });
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="profile-error">
          <div className="error-icon">⚠️</div>
          <h3>Error Loading Profile</h3>
          <p>{error}</p>
          <button className="retry-btn" onClick={loadUserProfile}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="profile-container">
        <div className="profile-error">
          <div className="error-icon">👤</div>
          <h3>No Profile Found</h3>
          <p>Unable to load user profile information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <span className="avatar-icon">👤</span>
        </div>
        <div className="profile-title">
          <h1>My Profile</h1>
          <p>Manage your account information and settings</p>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="card-header">
            <h2>Personal Information</h2>
            <button 
              className={`edit-btn ${isEditing ? 'editing' : ''}`}
              onClick={handleEditToggle}
              disabled={loading}
            >
              {isEditing ? '✕ Cancel' : '✏️ Edit Profile'}
            </button>
          </div>

          <div className="profile-details">
            <div className="detail-row">
              <div className="detail-label">
                <span className="label-icon">🆔</span>
                User ID
              </div>
              <div className="detail-value">{userProfile.id}</div>
            </div>

            <div className="detail-row">
              <div className="detail-label">
                <span className="label-icon">👤</span>
                Full Name
              </div>
              <div className="detail-value">
                {isEditing ? (
                  <input
                    type="text"
                    name="fullname"
                    value={editForm.fullname}
                    onChange={handleInputChange}
                    className="edit-input"
                    placeholder="Enter full name"
                  />
                ) : (
                  userProfile.fullname || 'Not provided'
                )}
              </div>
            </div>

            <div className="detail-row">
              <div className="detail-label">
                <span className="label-icon">📧</span>
                Email Address
              </div>
              <div className="detail-value">
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleInputChange}
                    className="edit-input"
                    placeholder="Enter email address"
                  />
                ) : (
                  userProfile.email || 'Not provided'
                )}
              </div>
            </div>

            <div className="detail-row">
              <div className="detail-label">
                <span className="label-icon">📱</span>
                Phone Number
              </div>
              <div className="detail-value">
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={editForm.phone}
                    onChange={handleInputChange}
                    className="edit-input"
                    placeholder="Enter phone number"
                  />
                ) : (
                  userProfile.phone || userProfile.Phone || 'Not provided'
                )}
              </div>
            </div>

            <div className="detail-row">
              <div className="detail-label">
                <span className="label-icon">🔑</span>
                User Role
              </div>
              <div className="detail-value">
                {isEditing ? (
                  <select
                    name="roll"
                    value={editForm.roll}
                    onChange={handleInputChange}
                    className="edit-select"
                  >
                    <option value="">Select role</option>
                    <option value="admin">Admin</option>
                    <option value="buyer">Buyer</option>
                    <option value="product_manager">Product Manager</option>
                  </select>
                ) : (
                  <span className={`role-badge role-${String(userProfile.roll || '').toLowerCase().replace(/\s+/g, '-')}`}>
                    {userProfile.roll || 'Not assigned'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="edit-actions">
              <button 
                className="save-btn"
                onClick={handleSaveProfile}
                disabled={loading}
              >
                {loading ? 'Saving...' : '💾 Save Changes'}
              </button>
              <button 
                className="cancel-btn"
                onClick={handleCancelEdit}
                disabled={loading}
              >
                ❌ Cancel
              </button>
            </div>
          )}
        </div>

        <div className="profile-stats">
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <div className="stat-number">Member</div>
              <div className="stat-label">Since Registration</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🔒</div>
            <div className="stat-content">
              <div className="stat-number">Secure</div>
              <div className="stat-label">Account Status</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-number">Verified</div>
              <div className="stat-label">Email Status</div>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <button className="action-btn primary">
            🔐 Change Password
          </button>
          <button className="action-btn secondary">
            📧 Update Email
          </button>
          <button className="action-btn outline">
            🗑️ Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
