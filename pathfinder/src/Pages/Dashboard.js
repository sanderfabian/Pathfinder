import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Navbar from '../Components/Navbar'; // Import the Navbar component
import { BeatLoader } from 'react-spinners';

function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const q = query(collection(firestore, 'User'), where('UID', '==', user.uid));
          const querySnapshot = await getDocs(q);
          const userDataArray = [];
          querySnapshot.forEach(doc => {
            userDataArray.push(doc.data());
          });
          setUserData(userDataArray);
        } else {
          console.log('User not logged in');
        }
        setLoading(false); // Set loading to false once user data is fetched or determined to be not logged in
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false); // In case of error, also set loading to false
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    // Display loading indicator while user data is being fetched
    return <div className="loading-screen">
    <BeatLoader color="#7100FF" loading={true} size={15} />
  </div>
  }

  return (
    <div>
      <Navbar loggedIn={!!userData} userData={userData} /> {/* Pass loggedIn and userData as props */}
      <h2>Dashboard</h2>
      <h2>Dashboard</h2>
     
      {userData &&
        userData.map((user, index) => (
          <div key={index}>
            <p>Name: {user.Username}</p>
            <p>Last Name: {user.Lname}</p>
            <p>UID: {user.UID}</p>
          </div>
        ))}
      <p>Collection as JSON:</p>
     
    
    </div>
  );
}

export default Dashboard;
