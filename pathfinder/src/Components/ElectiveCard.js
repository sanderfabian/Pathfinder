import React from 'react'
import Checkbox from '@mui/material/Checkbox';

export default function ElectiveCard({ courseCode, courseName, units ,courseType , handleCheckboxChange, isChecked}) {
    return (
      <div className='card courseCard'>
        <div>
          <h6 style={{ color: 'var(--Border)' }}>{courseCode}</h6>
          <h5 >{courseName}</h5>
          <h6 style={{ color: 'var(--FontDark)' }}>{courseType}</h6>
          <h5 style={{ color: 'var(--FontDark)' }}>{units ? `${units} units` : ''}</h5>
        </div>
        
        <Checkbox checked={isChecked} onChange={(e) => handleCheckboxChange(e, courseCode)} style ={{
                      color: "var(--Tertiary)",
                    }}/>
      </div>
    );
}
