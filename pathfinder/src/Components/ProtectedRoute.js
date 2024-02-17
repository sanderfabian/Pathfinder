import { UserAuthProvider, useUserAuth } from '../Components/AuthContext'; 
import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
    const { user } = useUserAuth(); // Get the user from the AuthProvider
  
    console.log('User:', user); // Log the user object
  
    // Check if user is authenticated
    const isAuthenticated = !!user;
  
    // If authenticated, render the children (protected component), otherwise redirect to login
    return isAuthenticated ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;