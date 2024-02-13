import React from 'react'
import Navbar from '../Components/Navbar'
import '../Styles/Home.css'
import Wiggle from '../Assets/Images/wIGGLE.svg'
import Triangle from '../Assets/Images/Triangle.svg'
import Bino from '../Assets/Images/HomeImg.png'
import Clap from '../Assets/Images/clapMicro.svg'
import Button from '../Components/Button'

export default function Home() {
    return (
        <div className='home'>

            <div className='gridHome'>
                <div className='grid-item grid-itemNav'><Navbar /></div>
                <div className='grid-item grid-item1'>
                    <div className='gridSplash'>
                        <div className='grid-item'>
                            <div className='welcome'>
                                <h4>Welcome to</h4>
                                <h1>PathFinder</h1>
                                <img src={Wiggle} />
                                <div>
                                    <img src={Triangle} />
                                    <h4>Made by UON, For UON</h4>
                                    
                                </div>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel euismod libero, et elementum elit. In pulvinar ultricies neque eu luctus. Cras finibus tortor a nulla scelerisque tempus. Morbi placerat.
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
                        <img src={Clap} width={80} height={80}/>
                        <div>
                        <h4>Are you interested yet?</h4>
                        <h2>Join Now</h2>
                        </div>
                        <Button variant={2} additionalClass={'regBoxBtn'} >Join Us</Button>
                    </div>

                </div>
                <div className='grid-item'>3</div>
                <div className='grid-item grid-item4'>4</div>
            </div>
        </div>
    )
}
