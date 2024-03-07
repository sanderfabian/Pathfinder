import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import PathwayCard from './PathwayCard';

function Semester({ semesterData, electiveCourses, electiveMajorCourses, eventHandler }) {
  const maxCards = 4; // Maximum number of cards per semester

  return (
    <Droppable droppableId={semesterData.semester} direction="horizontal">
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          className='semesterHolder'
          style={{backgroundColor:'#c9a2ff29'}}
        >
          <div className='semHeader'>
            <h4>Semester {semesterData.semester}</h4>
          </div>
          <div className='cHolder' {...provided.droppableProps}>
            {semesterData.courses.map((course, index) => (
              <Draggable key={course.id} draggableId={course.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    className='draggablePathwayCard'
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...provided.draggableProps.style,
                      border: snapshot.isDragging ? '5px Solid var(--Tertiary)' : 'none',
                      background: snapshot.isDragging ? 'var(--Tertiary)' : 'transparent',
                      borderRadius: snapshot.isDragging ? '15px' : 'none',
                      
                      height:snapshot.isDragging ? 'inherit' : 'inherit',
                      // Highlight the card being dragged
                    }}
                  >
                    <PathwayCard
                      courseCode={course.CourseCode}
                      courseName={course.Title}
                      courseType={course.CourseType}
                      mutable={course.Mutable}
                      electiveCourses={electiveCourses}
                      electiveMajorCourses={electiveMajorCourses}
                      meetsPrerequisites={course.meetsPrerequisites}
                      errMsg={course.errMsg}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {/* Render placeholder squares */}
            {[...Array(maxCards - semesterData.courses.length)].map((_, index) => (
              <div key={index} onClick={eventHandler} className="placeholder-square draggablePathwayCard" style={{ border: "3px dashed", borderRadius: 10 }}>
                <h1>+</h1>
              </div>
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
}

export default Semester;
