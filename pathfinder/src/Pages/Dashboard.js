import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '../firebase';
import Navbar from '../Components/Navbar';
import { BeatLoader } from 'react-spinners';
import PathwayCard from '../Components/PathwayCard';
import '../Styles/Dashboard.css';
import SmilingFace from '../Assets/Images/smilingFace.svg'
import Button from '../Components/Button';
import Semester from '../Components/Semester';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import ElectiveHolder from '../Components/ElectiveHolder';
import Requirment from '../Components/Requirement';


function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pathway, setPathwayData] = useState([]);
  const [electiveCourses, setElectiveCourses] = useState([]);
  const [electiveMajorCourses, setElectiveMajorCourses] = useState([]);
  const [electiveLoading, setElectiveLoading] = useState(true);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [majorData, setMajorData] = useState(null);
  const [loadingElectiveCourses, setLoadingElectiveCourses] = useState(true);
  const [loadingElectiveMajorCourses, setLoadingElectiveMajorCourses] = useState(true);
  const [electiveRequirement, setElectiveRequirement] = useState('');
  const [electiveRequirementUpdate, setElectiveRequirementUpdate] = useState('');
  const [electiveMajorRequirement, setElectiveMajorRequirement] = useState('');
  const [electiveMajorRequirementUpdate, setElectiveMajorRequirementUpdate] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isElectiveSatisfied, setIsElectiveSatisfied] = useState(false);
  const [isElectiveMajorSatisfied, setIsElectiveMajorSatisfied] = useState(false);
 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          console.log('User ID:', user.uid);
          const pathwayRef = collection(doc(firestore, 'User', user.uid), 'Pathway');
          console.log('Pathway Reference:', pathwayRef.path);

          const pathwaySnapshot = await getDocs(pathwayRef);
          const pathwayData = [];

          for (const pathwayDoc of pathwaySnapshot.docs) {
            const semesterRef = collection(pathwayDoc.ref, 'Courses');
            const semesterSnapshot = await getDocs(semesterRef);

            const semesterData = [];
            semesterSnapshot.forEach(doc => {
              console.log('Document ID:', doc.id);
              console.log('Document Data:', doc.data());

              const subcollectionData = { id: doc.id, ...doc.data() };
              semesterData.push(subcollectionData);
            });

            pathwayData.push({
              semester: pathwayDoc.id,
              courses: semesterData
            });
          }

          console.log('Pathway Data:', pathwayData);
          setLoading(false);
          setPathwayData(pathwayData);

          const userDocRef = doc(firestore, 'User', user.uid);
          const userDocSnapshot = await getDoc(userDocRef);
          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            const { Program, Major, Study } = userData;
            if (Program && Major && Study) {
              await fetchSubCollections(Program, Major, Study);
            } else {
              console.error('Program, Major, or Study is missing in the user document');
            }
          } else {
            console.error(`User document not found for UID "${user.uid}"`);
          }
        } else {
          console.log('User not logged in');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
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
        setElectiveRequirement(majorData.RequiredElectiveUnit);
        setElectiveMajorRequirement(majorData.RequiredElectiveMajorUnit);
        setElectiveMajorRequirementUpdate(electiveMajorRequirement);
        setElectiveRequirementUpdate(electiveRequirement);

        // Set the majorData state variable
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

          case 'Elective':
            courseType = 'Elective';
            mutable = false;
            break;
          case 'Elective Major':
            courseType = 'Elective Major';
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


      const electiveCoursesWithReferences = await fetchCourses('ElectiveCourses');
      const electiveCoursesData = await addCourseTypeToCourses(electiveCoursesWithReferences, 'Elective');
      setElectiveCourses(electiveCoursesData);
      setLoadingElectiveCourses(false);

      const electiveMajorCoursesWithReferences = await fetchCourses('ElectiveMajorCourses');
      const electiveMajorCoursesData = await addCourseTypeToCourses(electiveMajorCoursesWithReferences, 'Elective Major');
      setElectiveMajorCourses(electiveMajorCoursesData);
      setLoadingElectiveMajorCourses(false);


    } catch (error) {
      console.error('Error fetching subcollections:', error);
    }
  };


  const handleDragEnd = (result) => {
    // Logic to update the order of items after drag and drop
    // You'll need to update your state accordingly
    if (!result.destination) return; // Drop outside the droppable area

    const { source, destination } = result;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return; // Item dropped in the same position


    // Assuming pathway is an array of semesters
    const updatedPathway = [...pathway];
    const sourceSemesterIndex = updatedPathway.findIndex((sem) => sem.semester === source.droppableId);
    const destinationSemesterIndex = updatedPathway.findIndex((sem) => sem.semester === destination.droppableId);

    // Check if the destination semester already has four courses
    if (updatedPathway[destinationSemesterIndex].courses.length >= 4) return;

    // Assuming courses is an array within each semester
    const [draggedCourse] = updatedPathway[sourceSemesterIndex].courses.splice(source.index, 1);
    updatedPathway[destinationSemesterIndex].courses.splice(destination.index, 0, draggedCourse);

    // Check if the dragged course has a CompulsoryPrerequisite and if it's present in any previous semester
    if (
      draggedCourse.CompulsoryPrerequisite &&
      draggedCourse.CompulsoryPrerequisite !== 'Nil' &&
      draggedCourse.CompulsoryPrerequisite.some((prerequisite) => prerequisite !== 'Nil')
    ) {
      let allPrerequisitesFound = true;
      for (const prerequisite of draggedCourse.CompulsoryPrerequisite) {
        if (prerequisite === 'Nil') continue; // Skip if the prerequisite is "Nil"
        let prerequisiteFound = false;
        for (let i = destinationSemesterIndex - 1; i >= 0; i--) {
          // Check if the prerequisite is present in any course of the current prior semester
          prerequisiteFound = updatedPathway[i].courses.some((course) => String(course.id) === String(prerequisite));
          if (prerequisiteFound) break;
        }
        if (!prerequisiteFound) {
          allPrerequisitesFound = false;
          break;
        }
      }
      // Log if any of the prerequisites are not found in prior semesters
      if (!allPrerequisitesFound) {
        draggedCourse.Mutable = true;
        draggedCourse.errMsg = `Courses Required: "${draggedCourse.CompulsoryPrerequisite.join(', ')}"`;
      } else {
        draggedCourse.Mutable = false;
        draggedCourse.errMsg = '';
      }
    }

    // Iterate through all courses in the pathway and update Mutable and errMsg attributes
    updatedPathway.forEach((semester) => {
      semester.courses.forEach((course) => {
        if (
          course.CompulsoryPrerequisite &&
          course.CompulsoryPrerequisite !== 'Nil' &&
          course.CompulsoryPrerequisite.some((prerequisite) => prerequisite !== 'Nil')
        ) {
          let allPrerequisitesFound = true;
          for (const prerequisite of course.CompulsoryPrerequisite) {
            if (prerequisite === 'Nil') continue; // Skip if the prerequisite is "Nil"
            let prerequisiteFound = false;
            for (let i = updatedPathway.indexOf(semester) - 1; i >= 0; i--) {
              // Check if the prerequisite is present in any course of the current prior semester
              prerequisiteFound = updatedPathway[i].courses.some((c) => String(c.id) === String(prerequisite));
              if (prerequisiteFound) break;
            }
            if (!prerequisiteFound) {
              allPrerequisitesFound = false;
              break;
            }
          }
          if (!allPrerequisitesFound) {
            course.Mutable = true;
            course.errMsg = `Courses Required: "${course.CompulsoryPrerequisite.join(', ')}"`;
          } else {
            course.Mutable = false;
            course.errMsg = '';
          }
        }
      });
    });

    setPathwayData(updatedPathway);
    console.log(result);
  };

  useEffect(() => {
    updateElectiveRequirements(pathway);
    
  }, [pathway]);
  useLayoutEffect(() => {
    updateElectiveRequirements(pathway);
  }, [pathway]);

  const updateElectiveRequirements = (pathway) => {
    // Calculate the total units of elective and elective major courses in the pathway
    let totalElectiveUnits = 0;
    let totalElectiveMajorUnits = 0;

    pathway.forEach((semester) => {
      semester.courses.forEach((course) => {
        if (course.CourseType === 'Elective') {
          totalElectiveUnits += course.Unit;

        } else if (course.CourseType === 'Elective Major') {
          totalElectiveMajorUnits += course.Unit;

        }
      });
    });
    setElectiveRequirementUpdate(electiveRequirement - totalElectiveUnits);
    setElectiveMajorRequirementUpdate(electiveMajorRequirement - totalElectiveMajorUnits);
    // Check if elective and elective major requirements are satisfied
    const isElectiveSatisfied = totalElectiveUnits >= electiveRequirement;
    const isElectiveMajorSatisfied = totalElectiveMajorUnits >= electiveMajorRequirement;

    // Set the state variables to indicate satisfaction
    setIsElectiveSatisfied(isElectiveSatisfied);
    setIsElectiveMajorSatisfied(isElectiveMajorSatisfied);
    
  };



  const handleCheckboxChange = (event, courseId) => {
    const { checked } = event.target;

    // Find the course by its id in both elective and elective major courses
    const selectedElective = electiveCourses.find(course => course.id === courseId);
    const selectedElectiveMajor = electiveMajorCourses.find(course => course.id === courseId);

    if (checked) {
      // Determine whether the selected course is elective or elective major
      if (selectedElective) {
        // Find the first semester with less than four courses
        const firstSemesterWithSpace = pathway.find(semester => semester.courses.length < 4);

        if (firstSemesterWithSpace) {
          // Add the selected elective course to the first semester with space
          const updatedPathway = [...pathway];
          const updatedSemester = {
            ...firstSemesterWithSpace,
            courses: [...firstSemesterWithSpace.courses, selectedElective]
          };

          // Update the pathway with the modified semester
          const updatedPathwayWithCourse = updatedPathway.map(semester =>
            semester.semester === firstSemesterWithSpace.semester ? updatedSemester : semester
          );

          // Update the pathway state with the modified pathway
          setPathwayData(updatedPathwayWithCourse);
        } else {
          console.log('All semesters are full');
        }
      } else if (selectedElectiveMajor) {
        // Find the first semester with less than four courses
        const firstSemesterWithSpace = pathway.find(semester => semester.courses.length < 4);

        if (firstSemesterWithSpace) {
          // Add the selected elective major course to the first semester with space
          const updatedPathway = [...pathway];
          const updatedSemester = {
            ...firstSemesterWithSpace,
            courses: [...firstSemesterWithSpace.courses, selectedElectiveMajor]
          };

          // Update the pathway with the modified semester
          const updatedPathwayWithCourse = updatedPathway.map(semester =>
            semester.semester === firstSemesterWithSpace.semester ? updatedSemester : semester
          );

          // Update the pathway state with the modified pathway
          setPathwayData(updatedPathwayWithCourse);
        } else {
          console.log('All semesters are full');
        }
      } else {
        console.log('Course not found in elective or elective major courses');
      }
    } else {
      // If the checkbox is unchecked, remove the course from the pathway
      const updatedPathway = pathway.map(semester => ({
        ...semester,
        courses: semester.courses.filter(course => course.id !== courseId)
      }));
      setPathwayData(updatedPathway);

    }

    setIsChecked(checked);


  };


  if (loading || loadingElectiveCourses || loadingElectiveMajorCourses) {
    return (
      <div className="loading-screen">
        <BeatLoader color="#7100FF" loading={true} size={15} />
      </div>
    );
  }


  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="dashboard-container">
        <Navbar loggedIn={true} userData={null} />
        <div className="pathway-content">
          <div className="side-panel-container">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }} className={`side-panel ${isSidePanelOpen ? 'open' : 'closed'}`}>
              <div style={{ display: 'flex', padding: 10, justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--Secondary)', border: 'solid 3px #48484823', borderRadius: 5, marginTop: '10px' }}>
                <h5>Fulfill your Elective requirement</h5>
                <img src={SmilingFace} height={20} />
              </div>

              <div className='scrollable-div cardHolder'>
                {/* Render ElectiveHolder for Elective Courses */}
                <ElectiveHolder
                  collectionName='Elective Courses' // Change documents to collection
                  documents={electiveCourses}
                  handleCheck={handleCheckboxChange}
                  isChecked={isChecked}
                  pathway={pathway}
                />
                {/* Render ElectiveHolder for Elective Major Courses */}
                <ElectiveHolder
                  collectionName='Elective Major Courses' // Change documents to collection
                  documents={electiveMajorCourses}
                  handleCheck={handleCheckboxChange}
                  isChecked={isChecked}
                  pathway={pathway}
                />
              </div>
            </div>
            <button className={`side-panel-toggle ${isSidePanelOpen ? 'open' : ''}`} onClick={() => setIsSidePanelOpen(!isSidePanelOpen)} style={{ backgroundColor: isSidePanelOpen ? 'var(--Alert)' : 'var(--Tertiary)' }}>
              {isSidePanelOpen ? 'Close Panel' : 'Open Panel'}
            </button>
          </div>

          <div className='pathwayPanel'>
            <div>
              <div>
                <Requirment name="Elective  Units required:"  req={electiveRequirementUpdate} isSatisfied={isElectiveSatisfied} />
                <Requirment name="Elective  Major Units required:"  req={electiveMajorRequirementUpdate} isSatisfied={isElectiveMajorSatisfied} />
              </div>
            </div>
            <div className='btnControlPathway'>

              <Button variant={4} >Reset</Button>
              <Button variant={2} >Save</Button>
            </div>
          </div>
          <div className='pathwayHolder'>
            {pathway.map((semester, idx) => (
              <Semester key={idx} semesterData={semester} electiveCourses={electiveCourses} electiveMajorCourses={electiveMajorCourses} eventHandler={() => setIsSidePanelOpen(!isSidePanelOpen)} />
            ))}
          </div>
        </div>
      </div>
    </DragDropContext>
  );

}


export default Dashboard;
