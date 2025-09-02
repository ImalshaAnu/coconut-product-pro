import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Announcements.css';

const Announcements = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const announcements = [
    {
      id: 1,
      title: "New Export Opportunities in European Markets",
      category: "export",
      date: "2025-01-15",
      priority: "high",
      content: "We're excited to announce new export opportunities for coconut products in European markets. Several major retailers have expressed interest in our premium coconut oil and desiccated coconut products.",
      image: "/images/ll.jpg",
      author: "Export Team",
      tags: ["Export", "Europe", "Opportunity"]
    },
    {
      id: 2,
      title: "Farmer Training Program - Sustainable Coconut Farming",
      category: "training",
      date: "2025-01-12",
      priority: "medium",
      content: "Join our comprehensive training program on sustainable coconut farming practices. Learn modern techniques while preserving traditional methods. Limited seats available.",
      image: "/images/ii.jpg",
      author: "Training Department",
      tags: ["Training", "Sustainability", "Farming"]
    },
    {
      id: 3,
      title: "Quality Certification Update - New Standards Implemented",
      category: "quality",
      date: "2025-01-10",
      priority: "high",
      content: "We have successfully implemented new quality standards for all coconut products. This ensures our products meet international export requirements and maintain our reputation for excellence.",
      image: "/images/mm.jpg",
      author: "Quality Assurance",
      tags: ["Quality", "Certification", "Standards"]
    },
    {
      id: 4,
      title: "Coconut Festival 2025 - Save the Date",
      category: "event",
      date: "2025-01-08",
      priority: "medium",
      content: "Mark your calendars! The annual CocoLanka Coconut Festival will be held on March 15-17, 2025. Experience the best of Sri Lankan coconut culture, products, and networking opportunities.",
      image: "/images/nnn.png",
      author: "Events Team",
      tags: ["Festival", "Event", "Networking"]
    },
    {
      id: 5,
      title: "Mobile App Launch - Enhanced User Experience",
      category: "technology",
      date: "2025-01-05",
      priority: "medium",
      content: "Our new mobile app is now available! Get real-time updates on product availability, track your orders, and connect with farmers and exporters directly from your mobile device.",
      image: "/images/kkk.jpeg",
      author: "IT Department",
      tags: ["Mobile App", "Technology", "User Experience"]
    },
    {
      id: 6,
      title: "Partnership Announcement - Major Retail Chain",
      category: "partnership",
      date: "2025-01-03",
      priority: "high",
      content: "We're proud to announce a strategic partnership with a major international retail chain. This partnership will significantly expand our market reach and create more opportunities for our farmers.",
      image: "/images/ll.jpg",
      author: "Partnership Team",
      tags: ["Partnership", "Retail", "Expansion"]
    }
  ];

  const categories = [
    { id: 'all', name: 'All Announcements', icon: '📢' },
    { id: 'export', name: 'Export News', icon: '🌍' },
    { id: 'training', name: 'Training Programs', icon: '🎓' },
    { id: 'quality', name: 'Quality Updates', icon: '✅' },
    { id: 'event', name: 'Events', icon: '🎉' },
    { id: 'technology', name: 'Technology', icon: '💻' },
    { id: 'partnership', name: 'Partnerships', icon: '🤝' }
  ];

  const filteredAnnouncements = selectedCategory === 'all' 
    ? announcements 
    : announcements.filter(announcement => announcement.category === selectedCategory);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#e74c3c';
      case 'medium': return '#f39c12';
      case 'low': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high': return 'High Priority';
      case 'medium': return 'Medium Priority';
      case 'low': return 'Low Priority';
      default: return 'Standard';
    }
  };

  return (
    <div className="announcements-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-content">
            {/* Logo */}
            <div className="nav-logo">
              <div className="logo-icon">
                <span>🥥</span>
              </div>
              <div className="logo-text">
                <h1>CocoLanka</h1>
                <p>Sri Lankan Coconut Hub</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="nav-links desktop-nav">
              <a href="/" className="nav-link">Home</a>
              <a href="/announcements" className="nav-link active">Announcements</a>
              <a href="#" className="nav-link">Exporters Directory</a>
              <a href="#" className="nav-link">eMARKETPLACE</a>
              <a href="#" className="nav-link">Blog</a>
              <a href="#" className="nav-link">Contact Us</a>
            </div>

            {/* Auth Buttons */}
            <div className="auth-buttons desktop-auth">
              <button className="login-btn" onClick={() => navigate('/Login')}>Login</button>
              <button className="register-btn" onClick={() => navigate('/Register')}>Register</button>
            </div>

            {/* Mobile Menu Button */}
            <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="mobile-nav">
              <a href="/" className="mobile-nav-link">Home</a>
              <a href="/announcements" className="mobile-nav-link active">Announcements</a>
              <a href="#" className="mobile-nav-link">Exporters Directory</a>
              <a href="#" className="mobile-nav-link">eMARKETPLACE</a>
              <a href="#" className="mobile-nav-link">Blog</a>
              <a href="#" className="mobile-nav-link">Contact Us</a>
              <div className="mobile-auth-buttons">
                <button className="login-btn mobile" onClick={() => navigate('/Login')}>Login</button>
                <button className="register-btn mobile" onClick={() => navigate('/Register')}>Register</button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="announcements-hero">
        <div className="hero-content">
          <h1>Latest Announcements</h1>
          <p>Stay updated with the latest news, opportunities, and developments in the Sri Lankan coconut industry</p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="category-filter">
        <div className="container">
          <div className="filter-tabs">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`filter-tab ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="filter-icon">{category.icon}</span>
                <span className="filter-text">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Announcements Grid */}
      <section className="announcements-section">
        <div className="container">
          <div className="announcements-grid">
            {filteredAnnouncements.map((announcement) => (
              <div key={announcement.id} className="announcement-card">
                <div className="announcement-image">
                  <img src={announcement.image} alt={announcement.title} />
                  <div 
                    className="priority-badge"
                    style={{ backgroundColor: getPriorityColor(announcement.priority) }}
                  >
                    {getPriorityLabel(announcement.priority)}
                  </div>
                </div>
                
                <div className="announcement-content">
                  <div className="announcement-meta">
                    <span className="announcement-date">{announcement.date}</span>
                    <span className="announcement-author">by {announcement.author}</span>
                  </div>
                  
                  <h3 className="announcement-title">{announcement.title}</h3>
                  <p className="announcement-excerpt">{announcement.content}</p>
                  
                  <div className="announcement-tags">
                    {announcement.tags.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                  
                  <button className="read-more-btn">
                    Read Full Announcement
                    <span className="arrow">→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h2>Stay Updated</h2>
            <p>Subscribe to our newsletter to receive the latest announcements and industry updates directly in your inbox.</p>
            <div className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="newsletter-input"
              />
              <button className="newsletter-btn">Subscribe</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-main">
              <div className="footer-logo">
                <div className="logo-icon">
                  <span>🥥</span>
                </div>
                <div className="logo-text">
                  <h3>CocoLanka</h3>
                  <p>Sri Lankan Coconut Hub</p>
                </div>
              </div>
              <p className="footer-description">
                Connecting authentic Sri Lankan coconut producers with global markets. 
                Supporting local farmers while delivering premium quality products worldwide.
              </p>
              <div className="social-links">
                <div className="social-icon">f</div>
                <div className="social-icon">t</div>
                <div className="social-icon">in</div>
              </div>
            </div>

            <div className="footer-links">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="/">About Us</a></li>
                <li><a href="/announcements">Announcements</a></li>
                <li><a href="#">Products</a></li>
                <li><a href="#">Farmers</a></li>
                <li><a href="#">Exporters</a></li>
              </ul>
            </div>

            <div className="footer-contact">
              <h4>Contact Info</h4>
              <ul>
                <li>Colombo, Sri Lanka</li>
                <li>+94 11 234 5678</li>
                <li>info@cocolanka.lk</li>
                <li>www.cocolanka.lk</li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2025 CocoLanka. All rights reserved. Made with ❤️ in Sri Lanka</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Announcements;
