import React from 'react';
import { useNavigate } from 'react-router-dom';
import Triangle from '../Assets/Images/Triangle.svg';

export default function BackButton() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // Go back one page in the history stack
  };

  return (
    <div className='backBtnGroup'>
      <img src={Triangle} alt="Back" />
      <button className='backBtn' onClick={goBack}>Go Back</button>
    </div>
  );
}
