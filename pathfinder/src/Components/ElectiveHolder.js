import React, { useState, useEffect } from 'react';
import ElectiveCard from './ElectiveCard';

const ElectiveHolder = ({ collectionName, documents, handleCheck, pathway ,satColor }) => {
  // Create a state to store the checked state for each elective card
  const [checkedStates, setCheckedStates] = useState({});

  useEffect(() => {
    // Initialize checked states based on pathway
    const initialCheckedStates = {};
    pathway.forEach((semester) => {
      semester.courses.forEach((course) => {
        if (documents.find((doc) => doc.id === course.id)) {
          initialCheckedStates[course.id] = true;
        }
      });
    });
    setCheckedStates(initialCheckedStates);
  }, [documents, pathway]);

  // Function to toggle the checked state of an elective card
  const toggleCheckedState = (courseId) => {
    setCheckedStates((prevCheckedStates) => ({
      ...prevCheckedStates,
      [courseId]: !prevCheckedStates[courseId] // Toggle the checked state
    }));
  };

  return (
    <div>
      <div className='availableCourses card' style={{ border: 'solid 3px #48484823', backgroundColor: '#48484823', borderColor:satColor }}>
        <div className='reqType'>
          <h5 >{collectionName}</h5>
        </div>
        {/* Map each ElectiveCard */}
        {documents.map((doc, index) => (
          <ElectiveCard
            key={index}
            courseId={doc.id}
            courseCode={doc.CourseCode}
            courseName={doc.Title}
            units={doc.Unit}
            isChecked={checkedStates[doc.id] || false} // Use the individual checked state for each card
            handleCheckboxChange={(e) => {
              toggleCheckedState(doc.id); // Toggle the checked state when the checkbox is clicked
              handleCheck(e, doc.id); // Pass the courseId to handleCheckboxChange in Dashboard
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ElectiveHolder;
