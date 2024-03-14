import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from '../firebase';
import { collection, query, where, getDocs, doc, updateDoc ,addDoc,setDoc,deleteDoc} from 'firebase/firestore';
import { getDoc } from 'firebase/firestore';
import Navbar from '../Components/Navbar';
import { Link } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import Curious from '../Assets/Images/curious.png';
import BackButton from '../Components/BackButton';
import Button from '../Components/Button';
import '../Styles/Form.css';
import Checkbox from '@mui/material/Checkbox';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import KeyMicro from '../Assets/Images/KeyMicro.png';
import Triangle from '../Assets/Images/Triangle.svg';
import PathFinder from '../Assets/Images/PathFinder.svg';
import { useUserAuth } from '../Components/AuthContext';
import Load from '../Assets/Animations/load.json'
import Alert from '../Assets/Animations/alert.json'
import Tick from '../Assets/Animations/tick.json'
import Lottie from 'react-lottie';
import Loading from '../Components/Loading';

export default function Form() {
    const navigate = useNavigate();
    const { loading, user } = useUserAuth();
    const [userData, setUserData] = useState(null); // Define userData state
    const [degreeValue, setDegreeValue] = useState('');
    const [perSem, setPerSem] = useState('');
    const [majorValue, setMajorValue] = useState('');
    const [bachelorDegrees, setBachelorDegrees] = useState([]);
    const [majors, setMajors] = useState([]);
    const [showMajorGroup, setShowMajorGroup] = useState(false);
    const [study, setStudy] = useState('');
    const [pathwayCreated, setPathwayCreated] = useState(false);

    //const [sortedCourses, setSortedCourses] = useState([]);
    const [isProgramLoading, setIsProgramLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
   // const [pathway, setPathwayData] = useState([]);
    const {  setHasPathway } = useUserAuth();

    useEffect(() => {
        const fetchDegrees = async () => {
            try {
                setIsProgramLoading(true);
                const q = collection(firestore, study);
                const querySnapshot = await getDocs(q);
                const degrees = querySnapshot.docs.map(doc => doc.data().Title);
                setBachelorDegrees(degrees);
                setIsProgramLoading(false);

                // Reset other fields when degree type changes
                setDegreeValue('');
                setPerSem('');
                setMajorValue('');
                setShowMajorGroup(false);
            } catch (error) {
                //console.error('Error fetching degrees:', error);
            }
        };

        fetchDegrees();
    }, [study]);


    useEffect(() => {
        const fetchMajors = async () => {
            try {
                if (degreeValue) {
                    const cleanedDegreeValue = degreeValue.trim();
                    const studyQuery = query(collection(firestore, study), where('Title', '==', cleanedDegreeValue));
                    const studySnapshot = await getDocs(studyQuery);
                    if (!studySnapshot.empty) {
                        const studyDoc = studySnapshot.docs[0];
                        const majorCollectionRef = collection(firestore, study, studyDoc.id, 'Major');
                        const majorSnapshot = await getDocs(majorCollectionRef);
                        const majors = majorSnapshot.docs.map(doc => doc.data().Title);
                        setMajors(majors);
                        setShowMajorGroup(true);
                    } else {
                        console.error(`No ${study} found with title "${cleanedDegreeValue}"`);
                    }
                }
            } catch (error) {
                console.error('Error fetching majors:', error);
            }
        };

        fetchMajors();
    }, [degreeValue, study]);

    const isMajorSelectDisabled = loading || !degreeValue || !majors.length;

        const updateUser = async () => {
            try {
                if (user && user.uid && degreeValue && majorValue && perSem) {
                    const userDocRef = doc(firestore, 'User', user.uid);
                    const userDocSnapshot = await getDoc(userDocRef);
                    const cleanedDegreeValue = degreeValue.replace(/\s+/g, '');
                    const cleanedMajor = majorValue.replace(/\s+/g, '');

                    if (userDocSnapshot.exists()) {
                        await updateDoc(userDocRef, {
                            Study: study,
                            Major: cleanedMajor,
                            Program: cleanedDegreeValue,
                            CoursesPerSemester: perSem
                        });
                        console.log('User data updated successfully.');
                    } else {
                        console.error('User document not found.');
                    }
                } else {
                   
                }
            } catch (error) {
                console.error('Error updating user data:', error);
            }
        };

       

        useEffect(() => {
            const handlePathwayCreation = async () => {
                
                if (pathwayCreated) {
                    // Navigate to dashboard after pathway creation
                    setHasPathway(true);
                    navigate('/Dashboard');
                }
            };
    
            handlePathwayCreation();
        }, [pathwayCreated, navigate]);
    
        const handleNextButtonClick = async () => {
            // Start fetch operation
            setIsFetching(true);
            try {
                // Ensure majorValue, study, and perSem are defined
                if (!majorValue || !study || !perSem) {
                    console.error('Major value, study, or perSem is not defined.');
                    return;
                }
    
                const cleanedDegreeValue = degreeValue.replace(/\s+/g, '');
                const cleanedMajor = majorValue.replace(/\s+/g, '');
    
                // Update user data
                await updateUser();
    
                
    
                // Once subcollections are fetched, create pathway
                const sortedCoursesData = await fetchSubCollections(cleanedDegreeValue, cleanedMajor, study);
                const pathwayData = await createPathway(sortedCoursesData, parseInt(perSem));
    
                // Log pathway data
                console.log(pathwayData);
    
                // Save pathway to Firestore
                await savePathway(pathwayData);
    
                // Set pathwayCreated to true after pathway is saved
                setPathwayCreated(true);
            } catch (error) {
                console.error('Error:', error);
             
            }
        };
    
        
        

          

        
        
        if (loading ) { // Check if loading operation is in progress
            return (
                <Loading text="Loading..." subtext="Getting Ready!" color="var(--Secondary)"/>
            );
        }

        if (isFetching) { // Check if fetch operation is in progress
            return (
                <Loading text="Preparing your Pathway..." subtext="We're working on it!" color="var(--Tertiary)"/>
            );
        }

        
        const createPathway = async (sortedCourses, perSem) => {
            const totalCourses = sortedCourses.length;
            const numSemesters = Math.ceil(totalCourses / perSem);
            let pathway = [];
        
            for (let i = 0; i < numSemesters; i++) {
                const startIdx = i * perSem;
                const endIdx = Math.min(startIdx + perSem, totalCourses);
                const semesterCourses = sortedCourses.slice(startIdx, endIdx);
        
                pathway.push({
                    semester: String(i + 1),
                    courses: semesterCourses
                });
            }
        
            // Update pathway state using the functional form of setPathwayData
            
        
            return pathway;
        };
        
        
        

      
   
        const fetchSubCollections = async (cleanedDegreeValue, majorValue, study) => {
            try {
                const compulsoryCoursesData = [];
                console.log(cleanedDegreeValue);
                console.log(majorValue);
                console.log(study);
                const fetchCourses = async (collectionName) => {
                    const coursesRef = collection(doc(firestore, study, cleanedDegreeValue, 'Major', majorValue), collectionName);
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
                compulsoryCoursesData.push(...coreCoursesData);
        
                const majorCoursesWithReferences = await fetchCourses('MajorCourses');
                const majorCoursesData = await addCourseTypeToCourses(majorCoursesWithReferences, 'Major');
                compulsoryCoursesData.push(...majorCoursesData);
        
                // Log compulsoryCoursesData and its length to check if it's populated correctly
                console.log("Compulsory courses data length:", compulsoryCoursesData.length);
                console.log("Compulsory courses data:", compulsoryCoursesData);
        
                // Sort compulsoryCoursesData based on CompulsoryPrerequisite
                const sortedCoursesData = [];
                while (compulsoryCoursesData.length > 0) {
                    const course = compulsoryCoursesData.shift();
                    const hasPrerequisites = course.CompulsoryPrerequisite && course.CompulsoryPrerequisite.length > 0;
                    const hasNilPrerequisite = hasPrerequisites && course.CompulsoryPrerequisite.includes('Nil');
                    if (!hasPrerequisites || hasNilPrerequisite || course.CompulsoryPrerequisite.every(prerequisite => sortedCoursesData.find(c => c.id === prerequisite))) {
                        sortedCoursesData.push(course);
                    } else {
                        compulsoryCoursesData.push(course);
                    }
                }
        
                // Log sortedCoursesData
                console.log("Sorted courses:", sortedCoursesData);
        
                // Return the sorted data
                return sortedCoursesData;
            } catch (error) {
                console.error('Error fetching subcollections:', error);
                return []; // Return an empty array in case of error
            }
        };
        
        
        
        
        const savePathway = async (pathway) => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const userDocRef = doc(firestore, 'User', user.uid);
                    const pathwayRef = collection(userDocRef, 'Pathway');
        
                    // Delete existing pathway documents
                    await Promise.all(pathway.map(async (semester, index) => {
                        const semesterDocRef = doc(pathwayRef, (index + 1).toString());
                        const semesterSnapshot = await getDoc(semesterDocRef);
                        if (semesterSnapshot.exists()) {
                            await deleteDoc(semesterDocRef);
                        }
                    }));
        
                    // Create new pathway documents with updated data
                    await Promise.all(pathway.map(async (semester, index) => {
                        const semesterDocRef = doc(pathwayRef, (index + 1).toString());
                        const coursesRef = collection(semesterDocRef, 'Courses');
                        await setDoc(semesterDocRef, {}); // Create semester document
                        await Promise.all(semester.courses.map(async (course) => {
                            const courseDocRef = doc(coursesRef, course.id);
                            await setDoc(courseDocRef, course); // Create course document
                        }));
                    }));
                    setIsFetching(false);
    
              
                 
                    console.log('Pathway updated successfully!');
                  
                }
            } catch (error) {
                console.error('Error updating pathway:', error);
            }
        };
        
        
        
        
        
        
        
        
        
        
       
    return (
        <div className="loginBody" style={{ borderRadius: "10px", backgroundColor: "var(--Secondary)" }}>
            <img src={PathFinder} height={30} style={{ filter: "drop-shadow(3px 3px 2px rgb(0 0 0 / 0.4))" }} />
            <div className="loginRegBox" style={{ minWidth: "600px" }}>
                <div className="card">

                    <div className="cardHeader">
                        <div style={{ gap: "10px" }}>
                            <img src={Triangle} height={12} width={12} />
                            <h4>What are your pursuing?</h4>
                        </div>

                    </div>
                    <div >
                        <div className='formHeader formSpace'>

                            <div className='formFields'>

                                <div >
                                    <h4>Degree Type</h4>
                                    <div className='selectDrop'>
                                        <Select
                                            value={study}
                                            onChange={(event) => {
                                                setStudy(event.target.value.replace(/\s+/g, ''));
                                            }}
                                            placeholder="Select a degree type"
                                            fullWidth
                                           
                                        >
                                            <MenuItem value="BachelorDegree">Bachelor Degree</MenuItem>
                                            <MenuItem value="BachelorDegreeWithHonours">Bachelor Degree With Honours</MenuItem>
                                            <MenuItem value="MasterDegree">Master Degree</MenuItem>
                                        </Select>
                                        {!study && (
                                            <Lottie options={{ animationData: Alert, loop: 'false' }} width={30} height={30} />
                                        )}
                                        {isProgramLoading && study && (
                                            <Lottie options={{ animationData: Load }} width={20} height={20} />
                                        )}
                                        {!isProgramLoading && (
                                            <Lottie options={{ animationData: Tick, loop: 'false' }} width={30} height={30} />
                                        )}
                                    </div>
                                </div>
                                {!isProgramLoading && (
                                    <>
                                        <div>

                                            <h4>Select Program</h4>
                                            <div className='selectDrop'>
                                                <Select
                                                    value={degreeValue}
                                                    onChange={(event) => {
                                                        setDegreeValue(event.target.value);
                                                    }}
                                                    
                                                    placeholder="Choose a degree"
                                                    fullWidth
                                                >
                                                    {bachelorDegrees.map((degree, index) => (
                                                        <MenuItem key={index} value={degree}>{degree}</MenuItem>
                                                    ))}
                                                </Select>
                                                {!degreeValue && (
                                                    <Lottie options={{ animationData: Alert, loop: 'false' }} width={30} height={30} />
                                                )}
                                                {!showMajorGroup && degreeValue && (
                                                    <Lottie options={{ animationData: Load }} width={20} height={20} />
                                                )}
                                                {showMajorGroup && degreeValue && (
                                                    <Lottie options={{ animationData: Tick, loop: 'false' }} width={30} height={30} />
                                                )}
                                            </div>
                                        </div>

                                        {showMajorGroup && (
                                            <div id='majorGroup' >
                                                <h4>Select Major</h4>
                                                <div className='selectDrop'>
                                                    <Select
                                                        autoWidth={true}
                                                        value={majorValue}
                                                      
                                                        onChange={(event) => {
                                                            setMajorValue(event.target.value);
                                                        }}
                                                        placeholder="Select a major"
                                                        fullWidth
                                                    >
                                                        {majors.map((major, index) => (
                                                            <MenuItem key={index} value={major}>{major}</MenuItem>
                                                        ))}
                                                    </Select>
                                                    {!majorValue && (
                                                        <Lottie options={{ animationData: Alert, loop: 'false' }} width={30} height={30} />
                                                    )}

                                                    {majorValue && (
                                                        <Lottie options={{ animationData: Tick, loop: 'false' }} width={30} height={30} />
                                                    )}
                                                </div>
                                                <div>
                                                    <h4>Courses Per Semester</h4>
                                                    <div className='selectDrop'>
                                                        <Select
                                                            value={perSem}
                                                            onChange={(event) => {
                                                                setPerSem(event.target.value);
                                                            }}
                                                            placeholder="Select the number of courses"
                                                            fullWidth
                                                        >
                                                            <MenuItem value={1}>1</MenuItem>
                                                            <MenuItem value={2}>2</MenuItem>
                                                            <MenuItem value={3}>3</MenuItem>
                                                            <MenuItem value={4}>4</MenuItem>
                                                        </Select>
                                                        {!perSem && (
                                                            <Lottie options={{ animationData: Alert, loop: 'false' }} width={30} height={30} />
                                                        )}

                                                        {perSem && (
                                                            <Lottie options={{ animationData: Tick, loop: 'false' }} width={30} height={30} />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                        )}
                                    </>
                                )}
                            </div>
                            {degreeValue && majorValue && perSem && (
                                <div className='formBottomBtn'>
                                
                                        <Button variant={2} additionalClass='fatBtn' onClick={async () => await handleNextButtonClick()}>Create Your Pathway!</Button>
                                        
              
           
                                </div>
                            )}
                        </div>
                       
                    </div>
                  


                </div>
            </div>

        </div>
    );
}
