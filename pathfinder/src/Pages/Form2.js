import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from '../firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { getDoc } from 'firebase/firestore';
import Navbar from '../Components/Navbar';
import { BeatLoader } from 'react-spinners';
import Curious from '../Assets/Images/curious.png';
import BackButton from '../Components/BackButton';
import Button from '../Components/Button';
import '../Styles/Form.css';
import Checkbox from '@mui/material/Checkbox';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useUserAuth } from '../Components/AuthContext';

export default function Form2() {
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
  const [isProgramLoading, setIsProgramLoading] = useState(false);

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
        console.error('Error fetching degrees:', error);
      }
    };
  
    fetchDegrees();
  }, [study]);
  
  

  const updateUser = async (userId, majorValue, degreeValue, perSem) => {
    try {
      const userDocRef = doc(firestore, 'User', userId);
      await updateDoc(userDocRef, {
        Major: majorValue,
        Program: degreeValue,
        CoursesPerSemester: perSem,
        Study: "BachelorDegree"
      });
      console.log('User data updated successfully.');
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

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

  useEffect(() => {
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
          console.error('One or more required fields are empty.');
        }
      } catch (error) {
        console.error('Error updating user data:', error);
      }
    };

    updateUser();
  }, [user, degreeValue, majorValue, perSem]);

  const handleNextButtonClick = () => {
    updateUser();
    navigate('/Form3');
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <BeatLoader color="#7100FF" loading={true} size={15} />
      </div>
    );
  }

  return (
    <div className='form'>
      <Navbar loggedIn={!!userData} userData={userData} />
      <div className='formHolder'>
        <div className='gridForm'>
          <div className=' grid-item formBox'>
            <div className='formHeader'>
              <div>
                <BackButton></BackButton>
                <img src={Curious} height={60} />
              </div>
              <div>
                <h3>Begin Your Educational Profile</h3>
                <h5>Select the program of your dreams!</h5>
              </div>
              <div>
                <h4>Program</h4>
                <p>Please follow the appropriate steps below to start:</p>
              </div>
              <div>
                <h5>Select your Program</h5>
                <p>1. Choosing your program will give us a better idea on which core courses would be required in your recommended pathway.</p>
              </div>
              <div>
                <h5>Courses per Semester</h5>
                <p>1. You are free to choose how many courses per semester you will take, this may increase the number of years taken for full completion.</p>
              </div>
            </div>
          </div>
          <div className=' grid-item formBox'>
            <div className='formHeader formSpace'>
              
              <div className='formFields'>
              <div>
                <h3>What are you Pursuing?</h3>
                
              </div>
              <div>
                  <h4>Degree Type</h4>
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
                  </Select>
                </div>
                {!isProgramLoading && (
                  <>
                    <div>
                      
                      <h4>Select Program</h4>
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
                    </div>
                    <div>
                      <h4>Courses Per Semester</h4>
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
                    </div>
                    {showMajorGroup && (
                      <div id='majorGroup' >
                        <h4>Select Major</h4>
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
                      </div>
                    )}
                  </>
                )}
              </div>
              {degreeValue && majorValue && perSem && (
                <div className='formBottomBtn'>
                <Button variant={3} additionalClass='fatBtn' onClick={handleNextButtonClick}>Next: Choose Program</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
