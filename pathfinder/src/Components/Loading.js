import React from 'react';
import emojiLoad from '../Assets/Animations/emojiLoad.json';
import Lottie from 'react-lottie';
import { MoonLoader} from 'react-spinners';


export default function Loading({ text,subtext, color}) {
 


  return (
    <div className="loading-screen" style={{border:'none', backgroundColor:color}}>
    <div className="modal" >
      <div className="modalContent" style={{display:'flex', justifyContent:'center',alignItems:'center'}}>
      <Lottie options={{ animationData: emojiLoad }} width={100} height={100} style={{filter: "drop-shadow(3px 3px 2px rgb(0 0 0 / 0.2))", marginTop:"-80px"}} />
        <h3 style={{margin:'0px', color:color,letterSpacing:"-1px"}}>{text}</h3>
        <p style={{margin:'0px', color:"var(--FontDark)", marginBottom:"10px"}}>{subtext}</p>
        <MoonLoader color={color} loading={true} size={30} />
      </div>
    </div>
    </div>
  );
}
