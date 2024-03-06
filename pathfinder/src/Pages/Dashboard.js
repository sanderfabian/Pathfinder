import React, { useState, useEffect } from 'react';
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
import { DragDropContext } from 'react-beautiful-dnd';

function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pathway, setPathwayData] = useState([]);
  const [electiveCourses, setElectiveCourses] = useState([]);
  const [electiveMajorCourses, setElectiveMajorCourses] = useState([]);
  const [electiveLoading, setElectiveLoading] = useState(true);

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

    const fetchSubCollections = async (program, major, study) => {
      try {
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
              mutable = true;
              break;
            case 'Elective Major':
              courseType = 'Elective Major';
              mutable = true;
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

        const electiveCoursesWithReferences = await fetchCourses('ElectiveCourses');
        const electiveCoursesData = await addCourseTypeToCourses(electiveCoursesWithReferences, 'Elective');
        setElectiveCourses(electiveCoursesData);
        

        const electiveMajorCoursesWithReferences = await fetchCourses('ElectiveMajorCourses');
        const electiveMajorCoursesData = await addCourseTypeToCourses(electiveMajorCoursesWithReferences, 'Elective Major');
        setElectiveMajorCourses(electiveMajorCoursesData);
        

        setElectiveLoading(false);
      } catch (error) {
        console.error('Error fetching subcollections:', error);
      }
    };

    fetchData();
  }, []);

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
  
  
  
  
  
  
  
  
  

  if (loading || electiveLoading) {
    return (
      <div className="loading-screen">
        <BeatLoader color="#7100FF" loading={true} size={15} />
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div>
        <Navbar loggedIn={true} userData={null} />
        <div className='pathwayPanel'>
          <div>
            <img src={SmilingFace} height={30}/>
            <h3>{localStorage.Username}'s Pathway</h3>
          </div>
          <div className='btnControlPathway'>
            <Button variant={4} >Reset Pathway</Button>
            <Button variant={2} >Save Changes</Button>
          </div>
        </div>
        <div className='pathwayHolder'>
          {pathway.map((semester, idx) => (
            <Semester key={idx} semesterData={semester} electiveCourses={electiveCourses} electiveMajorCourses={electiveMajorCourses} />
          ))}
        </div>
      </div>
    </DragDropContext>
  );
}

export default Dashboard;
