import React,{useState} from 'react'
import axios from "axios";
import './Login.css';
const backgroundImage = process.env.PUBLIC_URL + '/images/nnn.png';

function Login() {
    const[email,setEmail] = useState("");
    const[password,setPassword] = useState("");
    const[showForgotPassword, setShowForgotPassword] = useState(false);
    const[forgotEmail, setForgotEmail] = useState("");
    const[forgotMessage, setForgotMessage] = useState("");

        const onSubmit = async (e) => {
     e.preventDefault();
     const loginDetails={email, password};
     
     try {
         const response = await axios.post("http://localhost:8080/login", loginDetails);
         console.log("Login response:", response.data);
         
         if(response.data.id){
             localStorage.setItem("userId", response.data.id);//save user ID to local storage
             localStorage.setItem("userRole", response.data.roll); // save user role
             console.log("Login successful, role:", response.data.roll); // Debug log
             alert("Login Successful");
             if (response.data.roll) {
                 const role = response.data.roll.toLowerCase();
                 console.log("Role after toLowerCase:", role); // Debug log
                 if (role === "admin") {
                     console.log("Navigating to admin dashboard"); // Debug log
                     window.location.href = "/admindashboard";
                 } else if (role === "buyer") {
                     console.log("Navigating to user dashboard"); // Debug log
                     window.location.href = "/user-dashboard";
                 } else if (role === "product_manager") {
                     console.log("Navigating to manager dashboard"); // Debug log
                     window.location.href = "/manager-dashboard";
                 } else {
                     console.log("Unknown role, reloading page"); // Debug log
                     window.location.reload(); // fallback
                 }
             } else {
                 console.log("No role found, reloading page"); // Debug log
                 window.location.reload(); // fallback
             }
         }else{
             alert("Login Failed. Please check your credentials.");
         }
         
     }catch(err){
         console.error("Login error:", err);
         
         if(err.response) {
             // Server responded with error status
             if(err.response.status === 401) {
                 alert("Invalid credentials. Please check your email and password.");
             } else {
                 alert(`Login failed: ${err.response.data.message || 'Server error'}`);
             }
         } else if(err.request) {
             // Network error
             alert("Network error. Please check your internet connection and try again.");
         } else {
             // Other error
             alert("An error occurred during login. Please try again.");
         }
     }
 }
 
 const handleForgotPassword = async (e) => {
     e.preventDefault();
     
     if (!forgotEmail.trim()) {
         setForgotMessage("Please enter your email address");
         return;
     }
     
     try {
         // Here you would typically make an API call to reset password
         console.log("Forgot password request for:", forgotEmail);
         
         // Simulate API call
         await new Promise(resolve => setTimeout(resolve, 1000));
         
         setForgotMessage("Password reset link has been sent to your email!");
         setForgotEmail("");
         
         // Hide forgot password form after 3 seconds
         setTimeout(() => {
             setShowForgotPassword(false);
             setForgotMessage("");
         }, 3000);
         
     } catch (error) {
         console.error("Forgot password error:", error);
         setForgotMessage("Failed to send reset link. Please try again.");
     }
 }
      return (
     <div 
       className="login-container"
       style={{ '--background-image': `url(${backgroundImage})` }}
     >
       <div className="login-card">
         <div className="login-header">
           <div className="logo-section">
             <span className="logo-icon">🥥</span>
             <h1>Welcome Back</h1>
           </div>
           <p>Sign in to your CocoLanka account</p>
         </div>
         
         {!showForgotPassword ? (
           <>
             <form onSubmit={(e)=> onSubmit(e)} className="login-form">
               <div className="form-group">
                 <label htmlFor="email">Email Address</label>
                 <input 
                   type="email" 
                   id="email" 
                   name="email" 
                   onChange={(e)=>setEmail(e.target.value)} 
                   value={email} 
                   placeholder="Enter your email address"
                   required 
                  />
               </div>
               
               <div className="form-group">
                 <label htmlFor="password">Password</label>
                 <input 
                   type="password" 
                   id="password" 
                   name="password" 
                   onChange={(e)=>setPassword(e.target.value)} 
                   value={password} 
                   placeholder="Enter your password"
                   required 
                  />
               </div>
               
               <div className="form-options">
                 <span className="forgot-password" onClick={() => setShowForgotPassword(true)}>
                   Forgot Password?
                 </span>
               </div>
               
               <button type="submit" className="form_btn">
                 <span>Sign In</span>
                 <span className="btn-icon">→</span>
               </button>
             </form>
           </>
         ) : (
           <>
             <div className="forgot-password-header">
               <h2>Reset Password</h2>
               <p>Enter your email address to receive a password reset link</p>
             </div>
             
             <form onSubmit={handleForgotPassword} className="login-form">
               <div className="form-group">
                 <label htmlFor="forgot-email">Email Address</label>
                 <input 
                   type="email" 
                   id="forgot-email" 
                   name="forgot-email" 
                   onChange={(e)=>setForgotEmail(e.target.value)} 
                   value={forgotEmail} 
                   placeholder="Enter your email address"
                   required 
                  />
               </div>
               
               {forgotMessage && (
                 <div className={`message ${forgotMessage.includes('sent') ? 'success-message' : 'error-message'}`}>
                   {forgotMessage}
                 </div>
               )}
               
               <button type="submit" className="form_btn">
                 <span>Send Reset Link</span>
                 <span className="btn-icon">→</span>
               </button>
               
               <button 
                 type="button" 
                 className="back-to-login-btn"
                 onClick={() => {
                   setShowForgotPassword(false);
                   setForgotEmail("");
                   setForgotMessage("");
                 }}
               >
                 <span>← Back to Login</span>
               </button>
             </form>
           </>
         )}
         
         <div className="login-footer">
           <p>Don't have an account? <span className="register-link" onClick={() => window.location.href = '/Register'}>Sign up here</span></p>
         </div>
       </div>
     </div>
   );
}

export default Login;
