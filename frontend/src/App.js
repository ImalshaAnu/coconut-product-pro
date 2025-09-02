import React from 'react';
import {Route, Routes} from "react-router";
import Home from './components/Home/Home';
import Additem from './components/Additem/Additem';
import DisplayItem from './components/DisplayItem/DisplayItem';
import UpdateItem from './components/UpdateItem/UpdateItem';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import AdminDashboard from './components/Admindashborad/Admindashborad';
import UserDashboard from './components/UserDashboard/UserDashboard';
import ManagerDashboard from './components/ManagerDashboard/ManagerDashboard';
import UserProfile from './components/UserProfile/UserProfile';
import Navi from './components/Navi/navi';
import Announcements from './components/Announcements/Announcements';


function App() {
  return (
    <div>
      <React.Fragment>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/announcements" element={<Announcements/>} />
          <Route path="/additem" element={<Additem/>} />
          <Route path="/allitems" element={<DisplayItem/>} />
          <Route path="/updateitem/:id" element={<UpdateItem/>} />
          {/* Add more routes as needed */}
          {/*User Management*/}
          <Route path="/Register" element={<Register/>} />
          <Route path="/Login" element={<Login/>} />
          {/* Add more user management routes as needed */}
          {/*Admin Dashboard*/}
          <Route path="/admindashboard" element={<AdminDashboard/>} />
          <Route path="/user-dashboard" element={<UserDashboard/>} />
          <Route path="/manager-dashboard" element={<ManagerDashboard/>} />
          <Route path="/profile" element={<UserProfile/>} />
          <Route path="/navi" element={<Navi/>} />
          
        </Routes>
      </React.Fragment>
      
  
    </div>
  );
}

export default App;
