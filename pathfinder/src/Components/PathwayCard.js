import React, { useState } from 'react';
import BeatLoader from 'react-spinners/BeatLoader';
import { auth, firestore } from '../firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import CourseGroupPathway from './CourseGroupPathway';
import PointDown from '../Assets/Images/pointDown.svg'
import Lottie from 'react-lottie';
import '../Styles/Dashboard.css';
import animationData from '../Assets/Animations/alert.json';


export default function PathwayCard({ courseCode, courseName, mutable, courseType, electiveCourses, electiveMajorCourses, errMsg }) {
  const [expanded, setExpanded] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCardClick = async () => {
    const user = auth.currentUser;
    if (mutable && user) {
      setExpanded(!expanded);
      if (!expanded) {
        setLoading(true);
        try {
          let fetchedCourses;
          if (courseType === 'Elective') {
            fetchedCourses = electiveCourses;
          } else if (courseType === 'Elective Major') {
            fetchedCourses = electiveMajorCourses;
          } else {
            fetchedCourses = [];
          }
          setCourses(fetchedCourses);
        } catch (error) {
          console.error('Error fetching courses:', error);
        } finally {
          setLoading(false);
        }
      }
    }
  };

  return (
    <div className='pathwayBlock'>
      <div className='pathwayCard' style={{ border: mutable ? '3px solid var(--Alert)' : '3px solid var(--Border)', cursor: 'grab' }}>
        <div className='courseDetails' onClick={handleCardClick}>
          <h5 style={{ color: 'var(--Tertiary)' }}>{courseType}</h5>
          {mutable && (
            <div style={{ backgroundColor: 'var(--Grey)', padding: 5, borderRadius: '10px', border: 'solid 3px #48484823',marginTop:'5px',marginBottom:'5px' }}>
              <Lottie options={{ animationData: animationData }} width={30} height={30} />
              <h5 style={{ color: 'var(--Alert)' }}>{errMsg}</h5>
            </div>
          )}
          <div>
            <h4 style={{ color: 'var(--FontDark)' }}>{courseName}</h4>
            <h5 style={{ color: 'var(--Border)' }}>{courseCode}</h5>
          </div>
        </div>
      </div>
    </div>

  );
}
