import React, { useState, useEffect } from 'react';
import { BeatLoader } from 'react-spinners';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'; // Import necessary Firestore functions
import { auth, firestore } from '../firebase'; // Import auth and firestore
import Navbar from '../Components/Navbar';
import CourseGroup from '../Components/CourseGroup';
import { useUserAuth } from '../Components/AuthContext';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Coursecard from '../Components/Coursecard';
import Triangle from '../Assets/Images/Triangle.svg';
import Button from '../Components/Button';
import Curious from '../Assets/Images/curious.png'


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
  const [electiveRequirement, setElectiveRequirement] = useState('');
  const [electiveMajorRequirement, setElectiveMajorRequirement] = useState('');
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [showCompulsory, setShowCompulsory] = useState(false);
  const [showCompulsoryHeader, setShowCompulsoryHeader] = useState('Show Compulsory Header');
  const [showCompulsoryRotate, setShowCompulsoryRotate] = useState('90deg');

const toggleView = () => {
  setShowCompulsory(!showCompulsory);
  if (showCompulsory== true){
    setShowCompulsoryHeader('Show Compulsory Courses')
    setShowCompulsoryRotate('90deg')
  }
  else{
    setShowCompulsoryHeader('Hide Compulsory Courses')
    setShowCompulsoryRotate('-90deg')
  }
};

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
        setMajorData(majorData);
        setElectiveRequirement(majorData.RequiredElectiveUnit)
        setElectiveMajorRequirement(majorData.RequiredElectiveMajorUnit) // Set the majorData state variable
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

      const addCourseTypeToCourses = async (coursesWithReferences, collectionName) => {
        const coursesWithCourseType = [];
        let courseType;
        let mutable;

        switch (collectionName) {
          case 'Core':
            courseType = 'Core';
            mutable = false;
            break;
          case 'Elective':
            courseType = 'Elective';
            mutable = false;
            break;
          case 'Elective Major':
            courseType = 'Elective Major';
            mutable = false;
            break;
          case 'Major':
            courseType = 'Major';
            mutable = false;
            break;
          default:
            courseType = '';
        }

        for (const course of coursesWithReferences) {
          const courseDocRef = doc(firestore, 'Course', course.id);
          const courseDocSnapshot = await getDoc(courseDocRef);
          if (courseDocSnapshot.exists()) {
            const actualCourseData = { id: courseDocSnapshot.id, ...courseDocSnapshot.data(), CourseType: courseType, Mutable: mutable };

            coursesWithCourseType.push(actualCourseData);
          }
        }
        return coursesWithCourseType;
      };

      const coreCoursesWithReferences = await fetchCourses('CoreCourses');
      const coreCoursesData = await addCourseTypeToCourses(coreCoursesWithReferences, 'Core');
      setCoreCourses(coreCoursesData);
      setLoadingCoreCourses(false);

      const electiveCoursesWithReferences = await fetchCourses('ElectiveCourses');
      const electiveCoursesData = await addCourseTypeToCourses(electiveCoursesWithReferences, 'Elective');
      setElectiveCourses(electiveCoursesData);
      setLoadingElectiveCourses(false);

      const electiveMajorCoursesWithReferences = await fetchCourses('ElectiveMajorCourses');
      const electiveMajorCoursesData = await addCourseTypeToCourses(electiveMajorCoursesWithReferences, 'Elective Major');
      setElectiveMajorCourses(electiveMajorCoursesData);
      setLoadingElectiveMajorCourses(false);

      const majorCoursesWithReferences = await fetchCourses('MajorCourses');
      const majorCoursesData = await addCourseTypeToCourses(majorCoursesWithReferences, 'Major');
      setMajorCourses(majorCoursesData);
      setLoadingMajorCourses(false);
    } catch (error) {
      console.error('Error fetching subcollections:', error);
    }
  };


  // DND

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
            setElectiveRequirement(electiveRequirement - draggedCourse.Unit)
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
            setElectiveMajorRequirement(electiveMajorRequirement - draggedCourse.Unit)
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

      case 'selection':
        draggedCourse = selectedCourses.find((course, index) => index === source.index);
        if (sourceGroup !== destinationGroup) {


          const updatedSourceCourses = [...selectedCourses];

          let updatedDestinationCourses;
          console.log(destinationGroup);
          switch (destinationGroup) {

            case 'Elective Courses':
              if (draggedCourse.CourseType === "Elective") {
                updatedSourceCourses.splice(source.index, 1);
                setSelectedCourses(updatedSourceCourses);
                updatedDestinationCourses = [...electiveCourses];
                updatedDestinationCourses.splice(destination.index, 0, draggedCourse);
                setElectiveCourses(updatedDestinationCourses);
                setElectiveRequirement(electiveRequirement + draggedCourse.Unit)
              }
              else {

              }
              break;
            case 'Elective Major Courses':
              if (draggedCourse.CourseType === "Elective Major") {
                updatedSourceCourses.splice(source.index, 1);
                setSelectedCourses(updatedSourceCourses);
                updatedDestinationCourses = [...electiveMajorCourses];
                updatedDestinationCourses.splice(destination.index, 0, draggedCourse);
                setElectiveMajorCourses(updatedDestinationCourses);
                setElectiveMajorRequirement(electiveMajorRequirement + draggedCourse.Unit)
              }
              else {

              }
              break;


          }




        }
        break;
    }


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
        <div className='formHolder form3'>
          <div className='gridForm gridForm3'>
            <div className='grid-item courseChoice '>
              <div className='form3Header'>
                <div>
            <h4>Choose your Electives</h4>
            <p>Satisfy your unit requirement by dragging your <br></br>electives into the drop zone to the left.</p>
            </div>
            <img src={Curious} height={50}/>
            </div>
              <div className='scrollable-div cardHolder'>
              <Droppable droppableId="electiveCourses">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    <CourseGroup collectionName="Elective Courses" documents={electiveCourses} requirement={electiveRequirement} />
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <Droppable droppableId="electiveMajorCourses">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    <CourseGroup collectionName="Elective Major Courses" documents={electiveMajorCourses} requirement={electiveMajorRequirement} />
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

            </div>
            </div>
            <div className='grid-item scrollable-div dropGrid dropGroup'>
              <div className='showCore' onClick={toggleView}>
                  <h4>{showCompulsoryHeader}</h4>
                  <img src={Triangle} height={12} width={12} style={{ transform: `rotate(${showCompulsoryRotate})` }} />
              </div>
              {showCompulsory ? (
                <div className='scrollable-div cardHolder compulsory'>
                  <h5 style={{ color: "var(--Teriary)" }} >Core</h5>
                  {coreCourses.map((doc, index) => (
                    <Coursecard
                      key={doc.id}
                      courseCode={doc.CourseCode}
                      courseName={doc.Title}
                    />
                  ))}
                  <h5 style={{ color: "var(--Teriary)" }} >Major</h5>
                  {majorCourses.map((doc, index) => (
                    <Coursecard
                      key={doc.id}
                      courseCode={doc.CourseCode}
                      courseName={doc.Title}
                    />
                  ))}
                </div>
              ) : (
                <Droppable droppableId='selection'>
                  {(provided) => (
                    <div className='dropZone scrollable-div' ref={provided.innerRef} {...provided.droppableProps}>
                      {selectedCourses.length === 0 ? (
                        <div className='dropZoneText'>
                          <h3 >Drop Your choices here</h3>
                        </div>
                      ) : null}
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
                                  courseType={doc.CourseType}
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
              )}
              <Button variant={2} additionalClass='fatBtn'>Generate Pathway!</Button>
            </div>
            
          </div>
        </div>
      </DragDropContext>
    </div>
  );
}
