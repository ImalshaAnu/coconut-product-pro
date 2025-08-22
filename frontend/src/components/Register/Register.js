import React,{useEffect,useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';
const backgroundImage = process.env.PUBLIC_URL + '/images/nnn.png';

function Register() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    fullname: '',
    email: '',
    password: '',
    phone: '',
    roll: ''
  });
  const [errors, setErrors] = useState({});
  const { fullname, email, password, phone, roll } = user;

  const onInputchange = async (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Real-time validation
    validateField(name, value);
  }
  
  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'password':
        if (value.length < 8) {
          error = 'Password must be at least 8 characters long';
        } else if (!/(?=.*[a-z])/.test(value)) {
          error = 'Password must contain at least one lowercase letter';
        } else if (!/(?=.*[A-Z])/.test(value)) {
          error = 'Password must contain at least one uppercase letter';
        } else if (!/(?=.*\d)/.test(value)) {
          error = 'Password must contain at least one number';
        } else if (!/(?=.*[@$!%*?&])/.test(value)) {
          error = 'Password must contain at least one special character (@$!%*?&)';
        }
        break;
        
      case 'phone':
        if (value.length !== 10) {
          error = 'Phone number must be exactly 10 digits';
        } else if (!/^\d{10}$/.test(value)) {
          error = 'Phone number must contain only digits';
        }
        break;
        
      case 'email':
        if (value && !/\S+@\S+\.\S+/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;
        
      case 'fullname':
        if (value && value.length < 2) {
          error = 'Full name must be at least 2 characters long';
        }
        break;
        
      case 'roll':
        if (value === '') {
          error = 'Please select a role';
        }
        break;
    }
    
    if (error) {
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  }
  
  const validateForm = () => {
    // Clear previous errors
    setErrors({});
    
    let hasErrors = false;
    
    // Validate all fields
    if (!user.fullname.trim()) {
      setErrors(prev => ({ ...prev, fullname: 'Full name is required' }));
      hasErrors = true;
    } else if (user.fullname.length < 2) {
      setErrors(prev => ({ ...prev, fullname: 'Full name must be at least 2 characters long' }));
      hasErrors = true;
    }
    
    if (!user.email.trim()) {
      setErrors(prev => ({ ...prev, email: 'Email is required' }));
      hasErrors = true;
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      hasErrors = true;
    }
    
    if (!user.password) {
      setErrors(prev => ({ ...prev, password: 'Password is required' }));
      hasErrors = true;
    } else if (user.password.length < 8) {
      setErrors(prev => ({ ...prev, password: 'Password must be at least 8 characters long' }));
      hasErrors = true;
    } else if (!/(?=.*[a-z])/.test(user.password)) {
      setErrors(prev => ({ ...prev, password: 'Password must contain at least one lowercase letter' }));
      hasErrors = true;
    } else if (!/(?=.*[A-Z])/.test(user.password)) {
      setErrors(prev => ({ ...prev, password: 'Password must contain at least one uppercase letter' }));
      hasErrors = true;
    } else if (!/(?=.*\d)/.test(user.password)) {
      setErrors(prev => ({ ...prev, password: 'Password must contain at least one number' }));
      hasErrors = true;
    } else if (!/(?=.*[@$!%*?&])/.test(user.password)) {
      setErrors(prev => ({ ...prev, password: 'Password must contain at least one special character (@$!%*?&)' }));
      hasErrors = true;
    }
    
    if (!user.phone) {
      setErrors(prev => ({ ...prev, phone: 'Phone number is required' }));
      hasErrors = true;
    } else if (user.phone.length !== 10) {
      setErrors(prev => ({ ...prev, phone: 'Phone number must be exactly 10 digits' }));
      hasErrors = true;
    } else if (!/^\d{10}$/.test(user.phone)) {
      setErrors(prev => ({ ...prev, phone: 'Phone number must contain only digits' }));
      hasErrors = true;
    }
    
    if (!user.roll) {
      setErrors(prev => ({ ...prev, roll: 'Please select a role' }));
      hasErrors = true;
    }
    
    return !hasErrors;
  }
  
  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      alert("Please fix the errors before submitting");
      return;
    }
    
    try {
      await axios.post("http://localhost:8080/user", user);
      alert("User Registered Successfully");
      navigate('/Login');
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
    }
  }
  
  return (
    <div 
      className="register-container"
      style={{ '--background-image': `url(${backgroundImage})` }}
    >
      <div className="register-card">
        <button 
          className="back-btn" 
          onClick={() => navigate('/')}
          title="Back to Home"
        >
          ←
        </button>
        
        <div className="register-header">
          <div className="logo-section">
            <span className="logo-icon">🥥</span>
            <h1>Join CocoLanka</h1>
          </div>
          <p>Create your account and start exploring premium Sri Lankan coconut products</p>
        </div>
        
        <form onSubmit={(e)=> onSubmit(e)} className="register-form">
          <div className="form-group">
            <label htmlFor="fullname">Full Name</label>
            <input 
              type="text" 
              id="fullname" 
              name="fullname" 
              onChange={(e)=>onInputchange(e)} 
              value={fullname} 
              placeholder="Enter your full name"
              required 
            />
            {errors.fullname && <div className="error-message">{errors.fullname}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              onChange={(e)=>onInputchange(e)} 
              value={email} 
              placeholder="Enter your email address"
              required 
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              onChange={(e)=>onInputchange(e)} 
              value={password} 
              placeholder="Create a strong password"
              required 
            />
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input 
              type="tel" 
              id="phone" 
              name="phone" 
              onChange={(e)=>onInputchange(e)} 
              value={phone} 
              placeholder="Enter 10-digit phone number"
              maxLength="10"
              required 
            />
            {errors.phone && <div className="error-message">{errors.phone}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="roll">Select Your Role</label>
            <select 
              id="roll" 
              name="roll" 
              onChange={(e)=>onInputchange(e)} 
              value={roll} 
              required
            >
              <option value="">--Choose your role--</option>
              <option value="admin">Admin</option>
              <option value="product_manager">Product Manager</option>
              <option value="buyer">Buyer</option>
            </select>
            {errors.roll && <div className="error-message">{errors.roll}</div>}
          </div>

          <button type="submit" className="form_btn">
            <span>Create Account</span>
            <span className="btn-icon">→</span>
          </button>
        </form>
        
        <div className="register-footer">
          <p>Already have an account? <span className="login-link" onClick={() => navigate('/')}>Sign in here</span></p>
        </div>
      </div>
    </div>
  );
}

export default Register;
