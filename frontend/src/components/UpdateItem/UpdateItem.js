import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './UpdateItem.css';

function UpdateItem() {
    const {id} = useParams();
    const [formData, setFormData] = useState({
        itemId: '',
        itemImage: null,
        itemName: '',
        itemQty: '',
        itemdescription: '',
        itemdate: '',
        itemprice: '',
        itemCategory: ''
    });
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(()=>{
        const fechItemData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/inventory/${id}`);
                const itemData = response.data;
                setFormData({
                    itemId: itemData.itemId || '',
                    itemImage: null,
                    itemName: itemData.itemName || '',
                    itemQty: itemData.itemQty || '',
                    itemdescription: itemData.itemdescription || '',
                    itemdate: itemData.itemdate || '',
                    itemprice: itemData.itemprice || '',
                    itemCategory: itemData.itemCategory || ''
                });
                setImagePreview(itemData.itemImage ? `http://localhost:8080/uploads/${itemData.itemImage}` : null);
            } catch (err) {
                console.error("Error fetching item data:", err);
            }
        };
        fechItemData();
    }, [id]);

    const onInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'itemImage') {
            const file = files[0];
            setFormData({ ...formData, itemImage: file });
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
            setFormData({ ...formData, [name]: value });
        }
    };

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("itemDetails", JSON.stringify({
        itemId: formData.itemId,
        itemName: formData.itemName,
        itemQty: formData.itemQty,  
        itemdescription: formData.itemdescription,
        itemdate: formData.itemdate,            
        itemprice: formData.itemprice,
        itemCategory: formData.itemCategory
    }));
    if (formData.itemImage) {
        data.append("file", formData.itemImage);
    }
        try {
            await axios.put(`http://localhost:8080/inventory/${id}`, data);
            alert("Item updated successfully");
            window.location.href = '/allitems';
    } catch (error) {
        console.error("Error updating item:", error);
        alert("Error updating item. Please try again.");
    }
  };

  return (
        <div className="update-bg">
            <h2 className="update-title-centered">Update Item</h2>
            <div className="update-split-card">
                <div className="update-split-image">
                    {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="update-image-preview-large" />
                    ) : (
                        <div className="update-image-placeholder">
                            <span role="img" aria-label="item" style={{fontSize: '5rem'}}>📦</span>
                            <p style={{marginTop: '1rem', color: '#888'}}>Item image preview</p>
                        </div>
                    )}
                </div>
                <div className="update-split-form">
                    <form className="update-form" onSubmit={onSubmit}>
                        <div className="update-row">
                            <label htmlFor="itemId" className="update-label">Item ID</label>
                            <input type="text" id="itemId" name="itemId" onChange={onInputChange} value={formData.itemId} className="update-input" required />
                        </div>
                        <div className="update-row">
                            <label htmlFor="itemName" className="update-label">Item Name</label>
                            <input type="text" id="itemName" name="itemName" onChange={onInputChange} value={formData.itemName} className="update-input" required />
                        </div>
                        <div className="update-row">
                            <label htmlFor="itemQty" className="update-label">Item Quantity</label>
                            <input type="number" id="itemQty" name="itemQty" onChange={onInputChange} value={formData.itemQty} className="update-input" required />
                        </div>
                        <div className="update-row">
                            <label htmlFor="itemdescription" className="update-label">Item Description</label>
                            <textarea id="itemdescription" name="itemdescription" rows="3" onChange={onInputChange} value={formData.itemdescription} className="update-input"></textarea>
                        </div>
                        <div className="update-row">
                            <label htmlFor="itemdate" className="update-label">Item Date</label>
                            <input type="date" id="itemdate" name="itemdate" onChange={onInputChange} value={formData.itemdate} className="update-input" required />
                        </div>
                        <div className="update-row">
                            <label htmlFor="itemprice" className="update-label">Item Price</label>
                            <input type="number" id="itemprice" name="itemprice" onChange={onInputChange} value={formData.itemprice} step="0.01" className="update-input" required />
                        </div>
                        <div className="update-row">
                            <label htmlFor="itemCategory" className="update-label">Item Category</label>
                            <select id="itemCategory" name="itemCategory" onChange={onInputChange} value={formData.itemCategory} className="update-input" required>
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
                        <div className="update-row">
                            <label htmlFor="itemImage" className="update-label">Item Image</label>
                            <input type="file" id="itemImage" name="itemImage" onChange={onInputChange} accept="image/*" className="update-input" />
                        </div>
                        <button type="submit" className="update-btn">Save Item</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateItem;
