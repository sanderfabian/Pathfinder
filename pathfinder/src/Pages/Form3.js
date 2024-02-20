import React, { useState, useEffect } from 'react';
import { BeatLoader } from 'react-spinners';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'; // Import necessary Firestore functions
import { auth, firestore } from '../firebase'; // Import auth and firestore
import Navbar from '../Components/Navbar';
import CourseGroup from '../Components/CourseGroup';
import { useUserAuth } from '../Components/AuthContext';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Coursecard from '../Components/Coursecard';


export default function Form3() {
  const { loading } = useUserAuth();
  const [program, setProgram] = useState('');
  const [majorData, setMajorData] = useState(null); // State variable to store majorData
  const [coreCourses, setCoreCourses] = useState([]);
  const [electiveCourses, setElectiveCourses] = useState([]);
  const [electiveMajorCourses, setElectiveMajorCourses] = useState([]);
  const [majorCourses, setMajorCourses] = useState([]);
  const [loadingCoreCourses, setLoadingCoreCourses] = useState(true);
  const [loadingElectiveCourses, setLoadingElectiveCourses] = useState(true);
  const [loadingElectiveMajorCourses, setLoadingElectiveMajorCourses] = useState(true);
  const [loadingMajorCourses, setLoadingMajorCourses] = useState(true);
  const [study, setStudy] = useState('');
  const [selectedCourses, setSelectedCourses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(firestore, 'User', user.uid);
          const userDocSnapshot = await getDoc(userDocRef);
          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            const { Program, Major, Study } = userData;
            setProgram(Program || '');
            setStudy(Study);
            if (Program && Major && Study) {
              fetchSubCollections(Program, Major, Study);
            } else {
              console.error('Program, Major, or Study is missing');
            }
          } else {
            console.error(`No user found with UID "${user.uid}"`);
          }
        } else {
          console.log('User not logged in');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);

  const fetchSubCollections = async (program, major, study) => {
    try {
      // Fetch the major document
      const majorDocRef = doc(firestore, study, program, 'Major', major);
      const majorDocSnapshot = await getDoc(majorDocRef);

      if (majorDocSnapshot.exists()) {
        const majorData = majorDocSnapshot.data();
        setMajorData(majorData); // Set the majorData state variable
        // You can extract other major attributes here if needed
      } else {
        console.error(`Major document not found for ${major}`);
      }

      const fetchCourses = async (collectionName) => {
        const coursesRef = collection(doc(firestore, study, program, 'Major', major), collectionName);
        const coursesSnapshot = await getDocs(coursesRef);
        const coursesData = [];

        for (const docRef of coursesSnapshot.docs) {
          const courseData = { id: docRef.id, ...docRef.data() };
          coursesData.push(courseData);
        }

        return coursesData;
      };

      const coreCoursesWithReferences = await fetchCourses('CoreCourses');
      const coreCoursesData = await fetchActualCourses(coreCoursesWithReferences);
      setCoreCourses(coreCoursesData);
      setLoadingCoreCourses(false);

      const electiveCoursesWithReferences = await fetchCourses('ElectiveCourses');
      const electiveCoursesData = await fetchActualCourses(electiveCoursesWithReferences);
      setElectiveCourses(electiveCoursesData);
      setLoadingElectiveCourses(false);

      const electiveMajorCoursesWithReferences = await fetchCourses('ElectiveMajorCourses');
      const electiveMajorCoursesData = await fetchActualCourses(electiveMajorCoursesWithReferences);
      setElectiveMajorCourses(electiveMajorCoursesData);
      setLoadingElectiveMajorCourses(false);

      const majorCoursesWithReferences = await fetchCourses('MajorCourses');
      const majorCoursesData = await fetchActualCourses(majorCoursesWithReferences);


      setMajorCourses(majorCoursesData);
      setLoadingMajorCourses(false);
    } catch (error) {
      console.error('Error fetching subcollections:', error);
    }
  };

  const fetchActualCourses = async (coursesWithReferences) => {
    const actualCoursesData = [];

    for (const course of coursesWithReferences) {
      const courseDocRef = doc(firestore, 'Course', course.Refer.id);
      const courseDocSnapshot = await getDoc(courseDocRef);
      if (courseDocSnapshot.exists()) {
        const actualCourseData = { id: courseDocSnapshot.id, ...courseDocSnapshot.data() };
        actualCoursesData.push(actualCourseData);
      }
    }

    return actualCoursesData;
  };


  // Form3.js

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Find source and destination CourseGroup
    const sourceGroup = source.droppableId;
    const destinationGroup = destination.droppableId;
    let draggedCourse = '';

    // Find dragged course
    switch (sourceGroup) {
      case 'Core Courses':
        draggedCourse = coreCourses.find((course, index) => index === source.index);
        if (sourceGroup !== destinationGroup) {
          // Remove course from source group
          const updatedSourceCourses = [...coreCourses];
          updatedSourceCourses.splice(source.index, 1);
          setCoreCourses(updatedSourceCourses);
          let updatedDestinationCourses;
          if (destinationGroup === 'selection') {
            updatedDestinationCourses = [...selectedCourses];
            updatedDestinationCourses.splice(destination.index, 0, draggedCourse);
            setSelectedCourses(updatedDestinationCourses);
          } else {
            // Update other groups similarly
          }
        } else {
          // If the course is moved within the same group, update state accordingly
          const updatedCourses = [...electiveCourses];
          updatedCourses.splice(source.index, 1);
          updatedCourses.splice(destination.index, 0, draggedCourse);
          setElectiveCourses(updatedCourses);
        }
        break;
      case 'Elective Courses':
        draggedCourse = electiveCourses.find((course, index) => index === source.index);
        if (sourceGroup !== destinationGroup) {
          // Remove course from source group
          const updatedSourceCourses = [...electiveCourses];
          updatedSourceCourses.splice(source.index, 1);
          setElectiveCourses(updatedSourceCourses);
          let updatedDestinationCourses;
          if (destinationGroup === 'selection') {
            updatedDestinationCourses = [...selectedCourses];
            updatedDestinationCourses.splice(destination.index, 0, draggedCourse);
            setSelectedCourses(updatedDestinationCourses);
          } else {
            // Update other groups similarly
          }
        } else {
          // If the course is moved within the same group, update state accordingly
          const updatedCourses = [...electiveCourses];
          updatedCourses.splice(source.index, 1);
          updatedCourses.splice(destination.index, 0, draggedCourse);
          setElectiveCourses(updatedCourses);
        }
        break;
      case 'Elective Major Courses':
        draggedCourse = electiveMajorCourses.find((course, index) => index === source.index);
        if (sourceGroup !== destinationGroup) {
          // Remove course from source group
          const updatedSourceCourses = [...electiveMajorCourses];
          updatedSourceCourses.splice(source.index, 1);
          setElectiveMajorCourses(updatedSourceCourses);
          let updatedDestinationCourses;
          if (destinationGroup === 'selection') {
            updatedDestinationCourses = [...selectedCourses];
            updatedDestinationCourses.splice(destination.index, 0, draggedCourse);
            setSelectedCourses(updatedDestinationCourses);
          } else {
            // Update other groups similarly
          }
        } else {
          // If the course is moved within the same group, update state accordingly
          const updatedCourses = [...electiveMajorCourses];
          updatedCourses.splice(source.index, 1);
          updatedCourses.splice(destination.index, 0, draggedCourse);
          setElectiveMajorCourses(updatedCourses);
        }
        break;
      case 'Major Courses':
        draggedCourse = majorCourses.find((course, index) => index === source.index);
        if (sourceGroup !== destinationGroup) {
          // Remove course from source group
          const updatedSourceCourses = [...majorCourses];
          updatedSourceCourses.splice(source.index, 1);
          setMajorCourses(updatedSourceCourses);
          let updatedDestinationCourses;
          if (destinationGroup === 'selection') {
            updatedDestinationCourses = [...selectedCourses];
            updatedDestinationCourses.splice(destination.index, 0, draggedCourse);
            setSelectedCourses(updatedDestinationCourses);
          } else {
            // Update other groups similarly
          }
        } else {
          // If the course is moved within the same group, update state accordingly
          const updatedCourses = [...majorCourses];
          updatedCourses.splice(source.index, 1);
          updatedCourses.splice(destination.index, 0, draggedCourse);
          setMajorCourses(updatedCourses);
        }
        break;
    }
    console.log(sourceGroup);
    console.log(draggedCourse);

    // Update state based on drag and drop


    // Add course to destination group

  };





  if (loading || loadingCoreCourses || loadingElectiveCourses || loadingElectiveMajorCourses || loadingMajorCourses) {
    return (
      <div className="loading-screen">
        <BeatLoader color="#7100FF" loading={true} size={15} />
      </div>
    );
  }

  return (
    <div className='form'>
      {/* Navbar and form structure */}
      <Navbar />
      <DragDropContext onDragEnd={onDragEnd}>
        <div className='formHolder'>
          <div className='gridForm gridForm3'>
            <div className='grid-item scrollable-div cardHolder'>
              <Droppable droppableId="coreCourses">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    <CourseGroup collectionName="Core Courses" documents={coreCourses} />
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <Droppable droppableId="electiveCourses">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    <CourseGroup collectionName="Elective Courses" documents={electiveCourses} requirement={majorData?.RequiredElectiveUnit} />
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <Droppable droppableId="electiveMajorCourses">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    <CourseGroup collectionName="Elective Major Courses" documents={electiveMajorCourses} requirement={majorData?.RequiredElectiveMajorUnit} />
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <Droppable droppableId="majorCourses">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    <CourseGroup collectionName="Major Courses" documents={majorCourses} />
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            <div className='grid-item scrollable-div cardHolder '>
              <Droppable droppableId='selection'>
                {(provided) => (
                  <div className='bobby' ref={provided.innerRef} {...provided.droppableProps}>
                    {selectedCourses.map((doc, index) => (
                      <Draggable key={doc.id} draggableId={doc.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div key={doc.id}>
                              <Coursecard
                                courseCode={doc.CourseCode}
                                courseName={doc.Title}
                                units={doc.Unit}
                              />
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

          </div>
        </div>
      </DragDropContext>
    </div>
  );
}
