import React from 'react'
import Button from './Button'
import Logo from '../Assets/Images/PathFinder.svg';
import KeyMicroImage from '../Assets/Images/KeyMicro.png';
import ThumbsUpMicro from '../Assets/Images/ThumbsUpMicro.svg'
import '../Styles/Pathfinder.css';

export default function Navbar() {
  return (
    <div>
        <div className='nav'>
            <img src={Logo} className='brandName'/>
            <div className='loginGroup'>
                <Button variant={1} img={KeyMicroImage}>Login</Button>
                <Button variant={2} img={ThumbsUpMicro}>Register</Button>
            </div>
        </div>
    </div>
  )
}
