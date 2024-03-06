import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, signInWithEmailAndPassword } from '../firebase';
import KeyMicro from '../Assets/Images/KeyMicro.png';
import Triangle from '../Assets/Images/Triangle.svg';
import PathFinder from '../Assets/Images/PathFinder.svg';
import '../Styles/Login.css';
import { useUserAuth } from '../Components/AuthContext';
import Button from '../Components/Button';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useUserAuth(); // Access login method from AuthContext
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setError(null);
      await login(email, password); // Use login method from AuthContext
      navigate('/Dashboard');
    } catch (error) {

      
      
      setError('Invalid E-mail or Password');
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="loginBody">
      <img src={PathFinder} height={40} />
      <div className="loginRegBox">
        <div className="card">
        
          <div className="cardHeader">
            <div>
              <img src={Triangle} height={12} width={12} />
              <h4>Login</h4>
            </div>
            <img src={KeyMicro} height={32} width={32} />
          </div>
          <div className="loginFields">
            <h5>Email:</h5>
            <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="loginFields">
            <h5>Password:</h5>
            <input type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
            
            <Button variant={3} additionalClass="fatBtn" onClick={handleLogin}>Login</Button>

          </div>
          <div className="card">
          <div className="cardHeader">
            <div>
              <img src={Triangle} height={12} width={12} />
              <h4>Don't have an account?</h4>
            </div>
            <img src={KeyMicro} height={32} width={32} />
          </div>
          <Button onClick={handleRegister} variant={2} additionalClass="fatBtn">Register</Button>
        </div>
      </div>
    </div>
  );
}

export default Login;
