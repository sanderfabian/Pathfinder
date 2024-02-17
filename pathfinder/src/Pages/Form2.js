import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, firestore } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
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
  const [userData, setUserData] = useState(null);
  const { loading } = useUserAuth();
  const [isChecked, setIsChecked] = useState(false);
  const [degreeValue, setDegreeValue] = useState('');
  const [bachelorDegrees, setBachelorDegrees] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const q = query(collection(firestore, 'User'), where('UID', '==', user.uid));
          const querySnapshot = await getDocs(q);
          const userDataArray = [];
          querySnapshot.forEach(doc => {
            userDataArray.push(doc.data());
          });
          setUserData(userDataArray);
        } else {
          console.log('User not logged in');
        }
        //setLoading(false); // Set loading to false once user data is fetched or determined to be not logged in
      } catch (error) {
        console.error('Error fetching user data:', error);
        //setLoading(false); // In case of error, also set loading to false
      }
    };

    const fetchBachelorDegrees = async () => {
      try {
        const q = collection(firestore, 'BachelorDegree');
        const querySnapshot = await getDocs(q);
        const degrees = [];
        querySnapshot.forEach(doc => {
          degrees.push(doc.data().Title);
        });
        setBachelorDegrees(degrees);
      } catch (error) {
        console.error('Error fetching bachelor degrees:', error);
      }
    };

    fetchUserData();
    fetchBachelorDegrees();
  }, []);





  if (loading) {
    // Display loading indicator while user data is being fetched
    return <div className="loading-screen">
      <BeatLoader color="#7100FF" loading={true} size={15} />
    </div>
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
              <div >
              <div>
                <h3>What are you Pursuing?</h3>

              </div>
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

                  value={degreeValue}
                  onChange={(event) => {
                    setDegreeValue(event.target.value);
                  }}
                  placeholder="1"
                  fullWidth
                >
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                  <MenuItem value={4}>4</MenuItem>

                </Select>
              </div>
              </div>
              <Link to="/Form1">
                <Button variant={3} additionalClass='fatBtn'>Next: Choose Program</Button>
              </Link>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
