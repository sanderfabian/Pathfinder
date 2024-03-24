import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { getDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import '../Styles/Home.css';
import { BeatLoader } from 'react-spinners';
import Wiggle from '../Assets/Images/wIGGLE.svg';
import Triangle from '../Assets/Images/Triangle.svg';
import Bino from '../Assets/Images/HomeImg.png';
import Clap from '../Assets/Images/clapMicro.svg';
import Button from '../Components/Button';
import PathFinder from '../Assets/Images/PathFinder.svg';
import KeyMicroImage from '../Assets/Images/KeyMicro.png';
import ThumbsUpMicro from '../Assets/Images/ThumbsUpMicro.svg';
import ReactPlayer from 'react-player';
import Pointer from '../Assets/Images/pointer.svg';










export default function Home() {
  const [homeData, setHomeData] = useState(null);

  useEffect(() => {
    const fetchFirstDocument = async () => {
      try {
        const q = collection(firestore, "Home");
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const firstDocumentData = querySnapshot.docs[0].data();
          setHomeData(firstDocumentData);
        } else {
          console.log('No documents found in the "Home" collection.');
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };

    fetchFirstDocument();
  }, []);

  // Check if homeData is not null before accessing its properties
  const homeParagraph = homeData ? homeData.HomeParagraph : "";
  const testimonialVideo = homeData ? homeData.TestimonialVideo : "";
  const videoLink = homeData ? homeData.VideoLink : "";
  const sideImage = homeData ? homeData.SideImage : "";
  const boxColour = homeData ? homeData.BoxColour : "";
  const logoImage = homeData ? homeData.LogoImage : "";
  localStorage.setItem('videoLink', videoLink);

  if (!homeParagraph && !testimonialVideo && !videoLink && !sideImage && !logoImage) {
    return (
      <div className="loading-screen">
        <BeatLoader color="#7100FF" loading={true} size={15} />
      </div>
    );
  }




  return (
    <div className='App'>
    <div className='home'>
      <div className='gridHome'>

        <div className='grid-item grid-item1'>
          <div className='gridSplash'>
            <div className='grid-item'>
              <div className='welcome'>
                <h4>Welcome to</h4>
                <img src={logoImage} height={30} style={{ filter: "drop-shadow(3px 3px 2px rgb(0 0 0 / 0.4))" }} />
                <img src={Wiggle} />
                <div>
                  <img src={Triangle} height={16} width={16} />
                  <h4>Made by UON, For UON</h4>
                </div>
                <p>
                  {homeParagraph}
                </p>
              </div>
            </div>
            <div className='grid-item'>
              <img src={Bino} className='bino' height={300} />
            </div>
          </div>
        </div>
        <div className='grid-item gr2' style={{ backgroundColor: "Var(--Secondary)", border: "3px solid #48484823" }}>
          <div className='video'>
            <div className='videoDesc'>
              <div>
                <img src={Clap} height={20} />
                <h4>Testimonial</h4>
              </div>
              <ReactPlayer url={testimonialVideo} className='vid' height="280px" width='356.4px' style={{ borderRadius: '10px', border: '4px solid black' }} />
            </div>
          </div>
        </div>
        <div className='grid-item gr3 ' style={{ background: "#c9a2ff29", color: "var(--FontDark)" }}>
          <div className='video'>
            <div className='videoDesc'>
              <div>
                <img src={Clap} height={20} />
                <h4>How does it work?</h4>
              </div>
              <ReactPlayer url={videoLink} className='vid' height="280px" width='356.4px' style={{ borderRadius: '10px', border: '4px solid black' }} />
            </div>
          </div>
        </div>
        <div className='grid-item grid-item4'>
          <div className='loginGroupHome'>
            <div className='mobileLogo' >
          <img src={logoImage} height={20} style={{filter:"drop-shadow(3px 3px 2px rgb(0 0 0 / 0.4))"}} />
          </div>
          
            <Link to="/login">
              <Button variant={1} img={KeyMicroImage}>Login</Button>
            </Link>
            <Link to="/register">
              <Button variant={2} img={ThumbsUpMicro}>Register</Button>
            </Link></div>
          <div className='testimonialHolder'>
            <div className='regBox' style={{ background: boxColour, justifyContent: "space-between" }}>
              <img src={sideImage} width="Auto" height="auto" className="sideImg" style={{ objectFit: "contain", maxHeight:"50vh" , borderRadius:"5px"}} />
              <div>




              </div>
              <Link to="/register">
                <Button variant={2} additionalClass={'regBoxBtn'} img={Clap} >Join Us</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
