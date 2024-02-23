import React from 'react';
import Coursecard from './Coursecard';

const CourseGroupPathway = ({ collectionName, documents }) => {
  return (
    <div>
      <div className='availableCourses card'>
        <div className='reqType'>
          <h5>{collectionName}</h5>
        </div>
        {/* Map each CourseCard */}
        {documents.map((doc, index) => (
          <div key={index}>
            <Coursecard
              courseCode={doc.CourseCode}
              courseName={doc.Title}
              
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseGroupPathway;
