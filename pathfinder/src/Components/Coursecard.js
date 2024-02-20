
import React from 'react'

export default function Coursecard({ courseCode, courseName, units }) {
    return (
      <div className='card courseCard'>
        <div>
          <h6 style={{ color: 'var(--Border)' }}>{courseCode}</h6>
          <h5 >{courseName}</h5>
        </div>
        <h5 style={{ color: 'var(--FontDark)' }}>{units} units</h5>
      </div>
    );
  }
  