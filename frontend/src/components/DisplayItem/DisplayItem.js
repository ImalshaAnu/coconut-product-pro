import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DisplayItem.css';

function DisplayItem() {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    const result = await axios.get('http://localhost:8080/inventory');
    setInventory(result.data);
  };

  const updateNavigate = (id) => {
    navigate(`/updateitem/${id}`);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
      try {
      await axios.delete(`http://localhost:8080/inventory/${deleteId}`);
      alert('Item deleted successfully');
      setShowModal(false);
      setDeleteId(null);
      loadInventory();
      } catch (error) {
      alert('Error deleting item. Please try again.');
      setShowModal(false);
      setDeleteId(null);
    }
  };

  const filteredInventory = inventory.filter(
    (item) =>
      item.itemName?.toLowerCase().includes(search.toLowerCase()) ||
      item.itemCategory?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="display-bg">
      <div className="display-header">
                        <div className="display-header-top">
                  <button className="back-btn" onClick={() => navigate('/manager-dashboard')}>
                    ←
                  </button>
                  <h1 className="display-title">Inventory System</h1>
                </div>
        <div className="display-header-bottom">
          <input
            className="display-search"
            type="text"
            placeholder="Search by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="display-grid">
        {filteredInventory.length === 0 ? (
          <div className="display-empty">No items found.</div>
        ) : (
          filteredInventory.map((item, index) => (
            <div className="display-card" key={index}>
              <div className="display-img-wrap">
                <img
                  src={`http://localhost:8080/uploads/${item.itemImage}`}
                  alt={item.itemName}
                  className="display-img"
                  onError={(e) => (e.target.style.display = 'none')}
                />
              </div>
              <div className="display-info">
                <h2 className="display-item-name">{item.itemName}</h2>
                <p className="display-item-desc">{item.itemdescription}</p>
                <div className="display-details">
                  <span>ID: {item.itemId}</span>
                  <span>Qty: {item.itemQty}</span>
                  <span>Date: {item.itemdate}</span>
                  <span>Price: ₹{item.itemprice}</span>
                  <span>Category: {item.itemCategory}</span>
                </div>
                <div className="display-actions">
                  <button className="display-btn update" onClick={() => updateNavigate(item.id)}>
                    Update
                  </button>
                  <button className="display-btn delete" onClick={() => handleDeleteClick(item.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            <div className="modal-icon">
              <svg width="70" height="70" viewBox="0 0 70 70">
                <circle cx="35" cy="35" r="32" stroke="#ff3366" strokeWidth="3" fill="none" />
                <line x1="25" y1="25" x2="45" y2="45" stroke="#ff3366" strokeWidth="3" strokeLinecap="round" />
                <line x1="45" y1="25" x2="25" y2="45" stroke="#ff3366" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
            <h2 className="modal-title">Are you sure?</h2>
            <p className="modal-desc">Do you really want to delete these records? This process cannot be undone.</p>
            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="modal-btn delete" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DisplayItem;
