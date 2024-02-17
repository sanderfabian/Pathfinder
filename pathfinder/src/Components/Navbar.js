import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from './Button';
import Logo from '../Assets/Images/PathFinder.svg';
import { useUserAuth } from '../Components/AuthContext'; // Import the useAuth hook
import { auth } from '../firebase';
import '../Styles/Pathfinder.css';

export default function Navbar() {
  const navigate = useNavigate();
  
  

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div>
      <div className='nav'>
        <img src={Logo} className='brandName' />
        
          <div className='loginGroup'>
            <div className='loggedUser'>
              <h5>Hi, </h5>
              <h5>{localStorage.getItem('Username')}</h5> {/* Update to use user.username */}
            </div>
            <Button onClick={handleLogout} variant={4}>Logout</Button>
          </div>
        
      </div>
    </div>
  );
}
