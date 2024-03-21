import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth ,firestore} from '../firebase';
import { doc, setDoc} from 'firebase/firestore';
import KeyMicro from '../Assets/Images/KeyMicro.png';
import Triangle from '../Assets/Images/Triangle.svg';
import PathFinder from '../Assets/Images/PathFinder.svg';
import '../Styles/Login.css';
import { useUserAuth} from '../Components/AuthContext';
import Button from '../Components/Button';
import BackButton from '../Components/BackButton';
import Loading from '../Components/Loading';


function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [valid, setValid] = useState(false);
    const [error, setError] = useState(null);
    const { createUser } = useUserAuth();
    const [isRegistering, setRegistering] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async () => {
        
        try {
            setError(null);
            const userCredential = await createUser(email, password);
            const user = userCredential.user;
    
        
           
            setRegistering(true);
            // Add user document to Firestore User collection
            const userRef = doc(firestore, 'User', user.uid);
            await setDoc(userRef, {
                Username: username,
                UID: user.uid
            });
    
            // Redirect to dashboard after successful registration
            navigate('/Dashboard');
        } catch (error) {
            console.error('Error registering user:', error);
            setError('Failed to register user. Please try again.');
            setRegistering(false);
        }
    };
    

    const handleConfirm = (cpassword) => {
        setValid(cpassword === password);
    };

    if (isRegistering) { 
        return (
            <Loading text="Welcome!" subtext="Creating your account..." color="var(--Tertiary)" />
        );
    }

    return (
        <div className="loginBody" style={{  backgroundColor: "var(--Tertiary)" }}>
         
            <div className="loginRegBox">
                <div className="card">
                    <BackButton/>
                    <div className="cardHeader">
                        <div>
                            <img src={Triangle} height={12} width={12} />
                            <h5>Register</h5>
                        </div>
                        <img src={KeyMicro} height={32} width={32} />
                    </div>
                    <div className="loginFields">
                        <h5>Username:</h5>
                        <input type="text" value={username} placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="loginFields">
                        <h5>Email:</h5>
                        <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="loginFields">
                        <h5>Password:</h5>
                        <input type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="loginFields">
                        <h5 >Confirm Password:</h5>
                        <input type="password" placeholder="Confirm Password" style={valid ? { border: 'solid transparent'  } : { border: '3px solid !important', borderColor:'var(--Alert)'}} onChange={(e) => handleConfirm(e.target.value)} />
                    </div>

                    <div>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </div>
                    {password && username && email && valid &&(
                        <Button variant={3} additionalClass="fatBtn"  onClick={handleRegister}>Register</Button>
                    )}


                </div>

            </div>
        </div>
    );
}

export default Register;
