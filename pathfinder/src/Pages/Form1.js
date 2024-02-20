import React, { useState, useEffect } from 'react';
import { useNavigate ,Link } from 'react-router-dom';
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

export default function Form1() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const { loading } = useUserAuth();
  const [isChecked, setIsChecked] = useState(false);
  const [degreeValue, setDegreeValue] = useState('');
  const [bachelorDegrees, setBachelorDegrees] = useState([]);

  useEffect(() => {
    

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

    
    fetchBachelorDegrees();
  }, []);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
    if (!event.target.checked) {
      // If checkbox is unchecked, clear degree value
      setDegreeValue('');
    }
  };



  if (loading) {
    // Display loading indicator while user data is being fetched
    return <div className="loading-screen">
    <BeatLoader color="#7100FF" loading={true} size={15} />
  </div>
  }

  return (
    <div className='form'>
      <Navbar loggedIn={!!userData} userData={userData} />
      <div className='formBox'>
        <div className='formHeader'>
          <div>
            <BackButton></BackButton>
            <img src={Curious} height={60} />
          </div>
          <div>
            <h3>Let us get to know you better</h3>
            <h5>Who are you?</h5>
          </div>
          <div>
            <h4>Welcome to UON</h4>
            <p>Please follow the appropriate steps below based on your status:</p>
          </div>
          <div>
            <h5>If you have been in our academy before:</h5>
            <p>1. Check the box indicating your previous enrollment.<br />2. Select the program you have previously completed or are currently enrolled in from the list provided.</p>
          </div>
          <div>
            <h5>If you are a fresh entrant:</h5>
            <p>1. Click the button below to proceed to the next form to begin your pathway generating process.</p>
          </div>

          <div className='toggleBoxGroup'>
            <div className='toggleBox' onClick={() => setIsChecked(!isChecked)}>
              <div>
              <h4>Have you been with UON before?</h4>
              <Checkbox checked={isChecked} onChange={handleCheckboxChange} />
              </div>
              <Select
                disabled={!isChecked}
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
            <Link to="/Form2">
            <Button variant={3} additionalClass='fatBtn'>Next: Choose Program</Button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
