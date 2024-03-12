import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserAuth } from '../Components/AuthContext';
import { BeatLoader } from 'react-spinners';

function PathwayRoute({ children }) {
  const { user, hasPathway, loading, getLoading } = useUserAuth();

  if (getLoading()) {
    return (
      <div className="loading-screen">
        <BeatLoader color="#7100FF" loading={true} size={15} />
      </div>
    );
  }

  if (!user) {
    // If user is not logged in, redirect to login page
    return <Navigate to="/login" />;
  }

  // Wait for pathway data to be loaded
  if (hasPathway !== null) {
    if (hasPathway) {
      // If user has pathway, render the children (protected component)
      return children;
    } else {
      // If user does not have pathway, redirect to form1
      return <Navigate to="/form" />;
    }
  }

  // Render loading spinner while waiting for pathway data
  return (
    <div className="loading-screen">
      <BeatLoader color="#7100FF" loading={true} size={15} />
    </div>
  );
}

export default PathwayRoute;
