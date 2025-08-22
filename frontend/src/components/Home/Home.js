import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const heroSlides = [
    {
      title: "Premium Sri Lankan Coconut Products",
      subtitle: "Direct from Local Farmers to Global Markets",
      image: "/images/ll.jpg",
      cta: "Explore Products"
    },
    {
      title: "Sustainable Coconut Farming",
      subtitle: "Supporting Local Communities & Environment",
      image: "/images/ii.jpg",
      cta: "Meet Our Farmers"
    },
    {
      title: "Export Quality Guaranteed",
      subtitle: "Certified Products for International Trade",
      image: "/images/mm.jpg",
      cta: "View Exporters"
    }
  ];

  const products = [
    { name: "Virgin Coconut Oil", icon: "🥥", description: "Cold-pressed, pure coconut oil" },
    { name: "Coconut Shell Crafts", icon: "🎨", description: "Handmade decorative items" },
    { name: "Coir Ropes", icon: "🪢", description: "Natural fiber ropes and mats" },
    { name: "Coconut Flour", icon: "🌾", description: "Gluten-free baking flour" },
    { name: "Desiccated Coconut", icon: "❄️", description: "Dried coconut flakes" },
    { name: "Coconut Water", icon: "💧", description: "Fresh natural coconut water" }
  ];

  const stats = [
    { number: "500+", label: "Local Farmers", icon: "👥" },
    { number: "50+", label: "Countries Served", icon: "🌍" },
    { number: "1000+", label: "Products Listed", icon: "🛒" },
    { number: "100%", label: "Organic Certified", icon: "🌿" }
  ];

  const features = [
    {
      icon: "🏆",
      title: "Quality Assured",
      description: "All products are certified organic and meet international quality standards for export."
    },
    {
      icon: "👥",
      title: "Support Local Farmers",
      description: "Direct trade relationships ensure fair prices and sustainable livelihoods for coconut farmers."
    },
    {
      icon: "📈",
      title: "Growing Network",
      description: "Join our expanding marketplace connecting Sri Lankan producers with global buyers."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
  
    <div className="home-container">
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
              <a href="#" className="nav-link active">Home</a>
              <a href="#" className="nav-link">Announcements</a>
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
              <a href="#" className="mobile-nav-link active">Home</a>
              <a href="#" className="mobile-nav-link">Announcements</a>
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
      <section className="hero-section">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${slide.image})`
            }}
          >
            <div className="hero-content">
              <h1 className="hero-title">{slide.title}</h1>
              <p className="hero-subtitle">{slide.subtitle}</p>
              <button className="hero-cta">
                <span>{slide.cta}</span>
                <span className="arrow">→</span>
              </button>
            </div>
          </div>
        ))}

        {/* Slide Indicators */}
        <div className="slide-indicators">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-icon">
                  <span>{stat.icon}</span>
                </div>
                <h3 className="stat-number">{stat.number}</h3>
                <p className="stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section">
        <div className="container">
          <div className="section-header">
            <h2>Premium Coconut Products</h2>
            <p>Discover authentic Sri Lankan coconut products, sustainably sourced from local farmers and crafted with traditional expertise.</p>
          </div>

          <div className="products-grid">
            {products.map((product, index) => (
              <div key={index} className="product-card">
                <div className="product-icon">
                  <span>{product.icon}</span>
                </div>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <button className="product-link">
                  Learn More
                  <span className="chevron">→</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header white-text">
            <h2>Why Choose CocoLanka?</h2>
            <p>We connect authentic Sri Lankan coconut producers with global markets, ensuring quality, sustainability, and fair trade.</p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-item">
                <div className="feature-icon">
                  <span>{feature.icon}</span>
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Explore Sri Lankan Coconut Products?</h2>
            <p>Join thousands of satisfied customers who trust CocoLanka for authentic, high-quality coconut products.</p>
            <div className="cta-buttons">
              <button className="btn-primary">Browse Marketplace</button>
              <button className="btn-secondary">Become a Seller</button>
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
                <li><a href="#">About Us</a></li>
                <li><a href="#">Products</a></li>
                <li><a href="#">Farmers</a></li>
                <li><a href="#">Exporters</a></li>
                <li><a href="#">Blog</a></li>
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
         <div>
        <button onClick={() => window.location.href = '/additem'}>Add Item</button>
        <button onClick={() => window.location.href = '/allitems'}>Allitems</button>
      
    </div>
    </div>
  );
};

export default Home;