import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Import Navigate for redirect
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Dashboard from './Pages/Dashboard';
import Form1 from './Pages/Form1';
import Form from './Pages/Form';
import './App.css';
import Form2 from './Pages/Form2';
import Form3 from './Pages/Form3';
import ProtectedRoute from './Components/ProtectedRoute'
import { UserAuthProvider, useUserAuth } from './Components/AuthContext'; // Import AuthProvider and useAuth
import PathwayRoute from './Components/PathwayRoute';

function App() {
  


  return (
    <UserAuthProvider> {/* Wrap your entire application with AuthProvider */}
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Check if user is authenticated before rendering protected routes */}
            <Route
              path="/dashboard"
              element={<ProtectedRoute><PathwayRoute><Dashboard/></PathwayRoute></ProtectedRoute>}
            ></Route>
            <Route
              path="/form1"
              element={<ProtectedRoute><Form1/></ProtectedRoute>}
            ></Route>
            <Route
              path="/form2"
              element={<ProtectedRoute><Form2/></ProtectedRoute>}
            ></Route>
            <Route
              path="/form"
              element={<Form/>}
            ></Route>
            <Route
              path="/form3"
              element={<ProtectedRoute><Form3/></ProtectedRoute>}
            ></Route>
          </Routes>
        </div>
      </Router>
    </UserAuthProvider>
  );
}

// Custom ProtectedRoute component to handle authentication


export default App;
