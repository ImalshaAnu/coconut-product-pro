import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Additem.css';

function Additem() {
    const navigate = useNavigate();
    const [inventory, setInventory] = useState({
        itemId: '',
        itemImage: '',
        itemName: '',
        itemQty: '',
        itemdescription: '',
        itemdate: '',
        itemprice: '',
        itemCategory: ''
    });
    const [imagePreview, setImagePreview] = useState(null);
    const { itemId, itemName, itemQty, itemdescription, itemdate, itemprice, itemCategory } = inventory;

    const onInputChange = e => {
        if (e.target.name === 'itemImage') {
            const file = e.target.files[0];
            setInventory({ ...inventory, itemImage: file });
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                setImagePreview(null);
            }
        } else {
            setInventory({ ...inventory, [e.target.name]: e.target.value });
        }
    };

    const onSubmit = async e => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', inventory.itemImage);
        let imageName = '';

        try {
            const response = await axios.post('http://localhost:8080/inventory/itemImg', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            imageName = response.data;
        } catch (error) {
            alert('Error uploading image');
            return;
        }
        const updateInventory = { ...inventory, itemImage: imageName };
        await axios.post('http://localhost:8080/inventory', updateInventory);
        alert('Item added successfully');
        window.location.reload();
    };

    return (
        <div className="additem-bg">
                            <div className="additem-header">
                    <button className="back-btn" onClick={() => navigate('/manager-dashboard')}>
                        ←
                    </button>
                    <h2 className="additem-title-centered">Add New Item</h2>
                </div>
            <div className="additem-split-card">
                <div className="additem-split-image">
                    {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="additem-image-preview-large" />
                    ) : (
                        <div className="additem-image-placeholder">
                            <span role="img" aria-label="item" style={{fontSize: '5rem'}}>📦</span>
                            <p style={{marginTop: '1rem', color: '#888'}}>Item image preview</p>
                        </div>
                    )}
                </div>
                <div className="additem-split-form">
                    <form className="additem-form" onSubmit={onSubmit}>
                        <div className="additem-row">
                            <label htmlFor="itemId" className="additem-label">Item ID</label>
                            <input type="text" id="itemId" name="itemId" onChange={onInputChange} value={itemId} className="additem-input" required />
                        </div>
                        <div className="additem-row">
                            <label htmlFor="itemName" className="additem-label">Item Name</label>
                            <input type="text" id="itemName" name="itemName" onChange={onInputChange} value={itemName} className="additem-input" required />
                        </div>
                        <div className="additem-row">
                            <label htmlFor="itemQty" className="additem-label">Item Quantity</label>
                            <input type="number" id="itemQty" name="itemQty" onChange={onInputChange} value={itemQty} className="additem-input" required />
                        </div>
                        <div className="additem-row">
                            <label htmlFor="itemdescription" className="additem-label">Item Description</label>
                            <textarea id="itemdescription" name="itemdescription" rows="3" onChange={onInputChange} value={itemdescription} className="additem-input"></textarea>
                        </div>
                        <div className="additem-row">
                            <label htmlFor="itemdate" className="additem-label">Item Date</label>
                            <input type="date" id="itemdate" name="itemdate" onChange={onInputChange} value={itemdate} className="additem-input" required />
                        </div>
                        <div className="additem-row">
                            <label htmlFor="itemprice" className="additem-label">Item Price</label>
                            <input type="number" id="itemprice" name="itemprice" onChange={onInputChange} value={itemprice} step="0.01" className="additem-input" required />
                        </div>
                        <div className="additem-row">
                            <label htmlFor="itemCategory" className="additem-label">Item Category</label>
                            <select id="itemCategory" name="itemCategory" onChange={onInputChange} value={itemCategory} className="additem-input" required>
                                <option value="" disabled>Select Item Category</option>
                                <option value="OIL">OIL</option>
                                <option value="FOOD">FOOD</option>
                                <option value="COIR">COIR</option>
                                <option value="HANDICRAFT">HANDICRAFT</option>
                                <option value="INDUSTRIAL">INDUSTRIAL</option>
                                <option value="BEVERAGE">BEVERAGE</option>
                                <option value="AGRICULTURE">AGRICULTURE</option>
                                <option value="HOUSEHOLD">HOUSEHOLD</option>
                                <option value="COSMETICS">COSMETICS</option>
                            </select>
                        </div>
                        <div className="additem-row">
                            <label htmlFor="itemImage" className="additem-label">Item Image</label>
                            <input type="file" id="itemImage" name="itemImage" onChange={onInputChange} accept="image/*" className="additem-input" />
                        </div>
                        <button type="submit" className="additem-btn">Save Item</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Additem;
