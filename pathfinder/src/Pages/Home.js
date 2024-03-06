import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import '../Styles/Home.css';
import Wiggle from '../Assets/Images/wIGGLE.svg';
import Triangle from '../Assets/Images/Triangle.svg';
import Bino from '../Assets/Images/HomeImg.png';
import Clap from '../Assets/Images/clapMicro.svg';
import Button from '../Components/Button';
import Logo from '../Assets/Images/PathFinder.svg';
import KeyMicroImage from '../Assets/Images/KeyMicro.png';
import ThumbsUpMicro from '../Assets/Images/ThumbsUpMicro.svg';
import ReactPlayer from 'react-player';
import Pointer from '../Assets/Images/pointer.svg';

export default function Home() {
  return (
    <div className='home'>
      <div className='gridHome'>
       
        <div className='grid-item grid-item1'>
          <div className='gridSplash'>
            <div className='grid-item'>
              <div className='welcome'>
                <h4>Welcome to</h4>
                <h1>PathFinder</h1>
                <img src={Wiggle} />
                <div>
                  <img src={Triangle} height={16} width={16} />
                  <h4>Made by UON, For UON</h4>
                </div>
                <p>
                  With Pathfinder, UON students can explore an academic pathway tailored to their interests, goals, and academic requirements. Pathfinder empowers students to make informed decisions about their academic journey.
                </p>
              </div>
            </div>
            <div className='grid-item'>
              <img src={Bino} height={300} />
            </div>
          </div>
        </div>
        <div className='grid-item'>
          <div className='regBox'>
            <img src={Clap} width={80} height={80} />
            <div>
              <h4>Are you interested yet?</h4>
              <h2>Join Now</h2>
            </div>
            <Link to="/login">
              <Button variant={2} additionalClass={'regBoxBtn'} >Join Us</Button>
            </Link>
          </div>
        </div>
        <div className='grid-item '>
          <div className='video'>
            <div className='videoDesc'>
              <div>
                <img src={Clap} height={20} />
                <h4>How does it work?</h4>
              </div>
              <ReactPlayer url='https://youtu.be/19PZH3ft8DQ' height="237.6px" width='356.4px' style={{ borderRadius: '10px', border: '4px solid black' }} />
            </div>
          </div>
        </div>
        <div className='grid-item grid-item4'>
          <div className='loginGroupHome'><Link to="/login">
            <Button variant={1} img={KeyMicroImage}>Login</Button>
          </Link>
            <Link to="/login">
              <Button variant={2} img={ThumbsUpMicro}>Register</Button>
            </Link></div>
            <div className='testimonialHolder'>  
          <div className='testimonialHeader'>
            <h4>Testimonials</h4>
            <img src={Pointer} height={30} />
          </div>
          
            Add testimonials here
          </div>
        </div>
      </div>
    </div>
  );
}
