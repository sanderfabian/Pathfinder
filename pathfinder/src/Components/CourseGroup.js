import React, { useState, useEffect } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import Coursecard from './Coursecard';

const CourseGroup = ({ collectionName, documents, requirement = 0 }) => {
  const [isSatisfied, setIsSatisfied] = useState(false);

  useEffect(() => {
    // Calculate totalUnit
    const totalUnit = documents.reduce((accumulator, doc) => accumulator + doc.Unit, 0);

    // Calculate target
    const target = totalUnit - requirement;

    // Determine if the requirement is satisfied
    setIsSatisfied(totalUnit === target);
  }, [documents, requirement, documents.length]); // Add documents and documents.length to the dependency array

  return (
    <div>
      <Droppable droppableId={collectionName}>
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <div className='availableCourses card' style={isSatisfied ? {  border:'solid var(--Tertiary)' } : { borderColor: 'var(--Alert)'}}>
              <div className='reqType'>
                <h5>{collectionName}</h5>
                {isSatisfied ? (
                  <h5 style={{ color: 'var(--Tertiary)' }}>Satisfied</h5>
                ) : (
                  <h5 style={{ color: 'var(--Alert)' }}>Units required: {requirement}</h5>
                )}
              </div>
              {/* Map each CourseCard to a Draggable component */}
              {documents.map((doc, index) => (
                <Draggable key={doc.id} draggableId={doc.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Coursecard
                        courseCode={doc.CourseCode}
                        courseName={doc.Title}
                        units={doc.Unit}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default CourseGroup;
