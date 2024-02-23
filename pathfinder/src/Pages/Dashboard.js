import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, doc } from 'firebase/firestore'; // Import necessary Firestore functions
import { auth, firestore } from '../firebase'; // Import auth and firestore
import Navbar from '../Components/Navbar'; // Import the Navbar component
import { BeatLoader } from 'react-spinners';
import PathwayCard from '../Components/PathwayCard';
import '../Styles/Dashboard.css'


function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pathway, setPathwayData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          console.log('User ID:', user.uid);
  
          // Reference to the "Pathway" collection for the current user
          const pathwayRef = collection(doc(firestore, 'User', user.uid), 'Pathway');
          console.log('Pathway Reference:', pathwayRef.path); // Log the path to check if it's correct
  
          const pathwaySnapshot = await getDocs(pathwayRef);
          const pathwayData = [];
  
          // Iterate through each semester in the "Pathway" collection
          for (const pathwayDoc of pathwaySnapshot.docs) {
            const semesterRef = collection(pathwayDoc.ref, 'Courses');
            const semesterSnapshot = await getDocs(semesterRef);
  
            // Process the documents within the semester
            const semesterData = [];
            semesterSnapshot.forEach(doc => {
              console.log('Document ID:', doc.id);
              console.log('Document Data:', doc.data());
  
              const subcollectionData = { id: doc.id, ...doc.data() };
              semesterData.push(subcollectionData);
            });
  
            // Add the semester data to the pathwayData array
            pathwayData.push({
              semester: pathwayDoc.id, // Assuming the semester is the document ID
              courses: semesterData
            });
          }
  
          console.log('Pathway Data:', pathwayData); // Log the pathway data
          setLoading(false);
          // Set pathwayData state
          setPathwayData(pathwayData);
        } else {
          console.log('User not logged in');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchData();
  }, []);
  
  
  
  if (loading) {
    // Display loading indicator while user data is being fetched
    return (
      <div className="loading-screen">
        <BeatLoader color="#7100FF" loading={true} size={15} />
      </div>
    );
  }

  return (
    <div>
      <Navbar loggedIn={true} userData={null} /> {/* Pass loggedIn and userData as props */}
      <h2>Dashboard</h2>
      <div className='pathwayHolder'>
      {pathway.map((data, idx) => (
        <div key={idx} className='semesterHolder'>
          <h4>{data.semester}</h4>
          <div className='cHolder'>
          {data.courses.map((course, index) => (
            <PathwayCard key={index} courseCode={course.CourseCode} courseName={course.Title} courseType={course.CourseType} mutable={course.Mutable}/>
          ))}
          </div>
        </div>
      ))}
    </div>
    </div>
  );
}

export default Dashboard;