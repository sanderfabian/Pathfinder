import React, { useState } from 'react';
import { collection, getDoc, getDocs, doc } from 'firebase/firestore';
import BeatLoader from 'react-spinners/BeatLoader'; // Import BeatLoader
import { auth, firestore } from '../firebase';
import CourseGroupPathway from './CourseGroupPathway';
import '../Styles/Dashboard.css';

export default function PathwayCard({ courseCode, courseName, mutable, courseType }) {
  const [expanded, setExpanded] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false); // State to track loading

  const handleCardClick = async () => {
    const user = auth.currentUser;
    if (mutable && user) {
      setExpanded(!expanded);
      if (!expanded) {
        try {
          setLoading(true); // Set loading to true when fetching courses starts
          const userDocRef = doc(firestore, 'User', user.uid);
          const userDocSnapshot = await getDoc(userDocRef);
          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            const { Program, Major, Study } = userData;
            if (Program && Major && Study) {
              const collectionName = `${courseType}Courses`;
              const coursesRef = collection(doc(firestore, Study, Program, 'Major', Major), collectionName);
              const snapshot = await getDocs(coursesRef);
              const fetchedCourses = [];
              for (const doc of snapshot.docs) {
                const courseDocSnapshot = await getDoc(doc.data().Refer);
                if (courseDocSnapshot.exists()) {
                  const courseData = { id: doc.id, ...courseDocSnapshot.data() };
                  fetchedCourses.push(courseData);
                } else {
                  console.error(`Course document not found for ID "${doc.id}"`);
                }
              }
              setCourses(fetchedCourses);
            } else {
              console.error('Program, Major, or Study is missing in the user document');
            }
          } else {
            console.error(`User document not found for UID "${user.uid}"`);
          }
        } catch (error) {
          console.error('Error fetching courses:', error);
        } finally {
          setLoading(false); // Set loading to false when fetching courses completes
        }
      }
    }
  };

  return (
    <div className='pathwayBlock'>
      <div className='pathwayCard' style={{ border: mutable ? '3px dashed var(--Border)' : '3px solid var(--Grey)' }}>
        <div onClick={handleCardClick}>
          <h6 style={{ color: 'var(--Border)' }}>{courseCode}</h6>
          <h5>{courseName}</h5>
          <h6 style={{ color: 'var(--FontDark)' }}>{courseType}</h6>
        </div>
      </div>
      {expanded && mutable && (
        <div className="modal-overlay" onClick={() => setExpanded(false)}>
          <div className="modal">
            <div className="modal-content">
              {loading ? ( // Display BeatLoader if loading is true
                <BeatLoader color={'var(--Tertiary)'} loading={loading} />
              ) : (
                <>
                  <h3>Choose a replacement</h3>
                  <div className="expandedContent scrollable-div">
                    <CourseGroupPathway documents={courses} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}