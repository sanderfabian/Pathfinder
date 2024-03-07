import React from 'react';
import SmilingFace from '../Assets/Images/smilingFace.svg'
import Lottie from 'react-lottie';

import animationData from '../Assets/Animations/alert.json';
import tick from '../Assets/Animations/tick.json'

export default function Requirement({ name, req, isSatisfied}) {
  return (
    <div className='requirementPill'>
      <div className='reqType'>
      {isSatisfied ? (
      <Lottie options={{ animationData: tick ,loop: false}} width={30} height={30} />)
      :(
        <Lottie options={{ animationData: animationData }} width={30} height={30} />
      )}
      <h5 style={{ color: isSatisfied ? 'var(--Tertiary)' : 'var(--Alert)', fontWeight:600 ,letterSpacing:'-0.5px' }}>{name}</h5>

        {isSatisfied ? (
          <h5 style={{ color: 'var(--Tertiary)' }}>Satisfied</h5>
        ) : (
          <h5 style={{ color: 'var(--Alert)' }}>{req}</h5>
        )}
      </div>
    </div>
  );
}
