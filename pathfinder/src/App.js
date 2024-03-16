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
import AdminRoute from './Components/AdminRoute'
import AdminPanel from './Pages/AdminPanel/AdminPanel';
import AdminLogin from './Pages/AdminPanel/AdminLogin';
import MCourses from './Pages/AdminPanel/MCourses';
import AdminRegister from './Pages/AdminPanel/AdminRegister'
import AddCourse from './Pages/AdminPanel/AddCourse';
import MPrograms from './Pages/AdminPanel/MPrograms';
import BachelorDegree from './Pages/AdminPanel/BachelorDegree';
import MajorDetails from './Pages/AdminPanel/MajorDetails';
import AddBDP from './Pages/AdminPanel/AddBDP';
import ViewCourses from './Pages/AdminPanel/ViewCourses';
import EditMajorDetails from './Pages/AdminPanel/EditMajorDetails';
import BachelorDegreeWithHonours from './Pages/AdminPanel/BachelorDegreeWithHonours';
import WHMajorDetails from './Pages/AdminPanel/WHMajorDetails';
import ViewWHCourses from './Pages/AdminPanel/ViewWHCourses';
import ViewMDCourses from './Pages/AdminPanel/ViewMDCourses';
import AddBDWHP from './Pages/AdminPanel/AddBDWHP';
import EditWHMajorDetails from './Pages/AdminPanel/EditWHMajorDetails';
import MDMajorDetails from './Pages/AdminPanel/MDMajorDetails';
import AddMDP from './Pages/AdminPanel/AddMDP';
import EditMDMajorDetails from './Pages/AdminPanel/EditMDMajorDetails';
import { createTheme, ThemeProvider } from '@mui/material/styles';


function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#7100ff', 
      },
    },
  });


  return (
    <UserAuthProvider> {/* Wrap your entire application with AuthProvider */}
      <Router>
        <div >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Check if user is authenticated before rendering protected routes */}
            <Route
              path="/dashboard"
              element={<ProtectedRoute><PathwayRoute><Dashboard /></PathwayRoute></ProtectedRoute>}
            ></Route>
            <Route
              path="/form1"
              element={<ProtectedRoute><Form1 /></ProtectedRoute>}
            ></Route>
            <Route
              path="/form2"
              element={<ProtectedRoute><Form2 /></ProtectedRoute>}
            ></Route>
            <Route
              path="/form"
              element={<Form />}
            ></Route>
            <Route
              path="/form3"
              element={<ProtectedRoute><Form3 /></ProtectedRoute>}
            ></Route>
              
            <Route path="/adminLogin" element={<AdminLogin/>} />
            <Route path="/add-course" element={<AdminRoute><ThemeProvider theme={theme}><AddCourse /></ThemeProvider></AdminRoute>} />
            <Route path="/mcourses" element={<AdminRoute><ThemeProvider theme={theme}><MCourses /></ThemeProvider></AdminRoute>} />
            <Route path="/add-course/:courseId" element={<AdminRoute><ThemeProvider theme={theme}><AddCourse /></ThemeProvider></AdminRoute>} />
            <Route path="/mprograms" element={<AdminRoute><ThemeProvider theme={theme}><MPrograms /></ThemeProvider></AdminRoute>} />
            <Route path="/bachelor-degree" element={<AdminRoute><ThemeProvider theme={theme}><BachelorDegree /></ThemeProvider></AdminRoute>} />
            <Route path="/major-details/:programId/:majorId" element={<AdminRoute><ThemeProvider theme={theme}><MajorDetails /></ThemeProvider></AdminRoute>} />
            <Route path="/edit-major/:programId/:majorId" element={<AdminRoute><ThemeProvider theme={theme}><EditMajorDetails /></ThemeProvider></AdminRoute>} />
            <Route path="/add-bdp" element={<AdminRoute><ThemeProvider theme={theme}><AddBDP /></ThemeProvider></AdminRoute>} />
            <Route path="/addBDP/:programId/:majorId" element={<AdminRoute><ThemeProvider theme={theme}><AddBDP /></ThemeProvider></AdminRoute>} />
            <Route path="/major-details/:programId" element={<AdminRoute><ThemeProvider theme={theme}><MajorDetails /></ThemeProvider></AdminRoute>} />
            <Route path="/view-courses/:programId/:majorId" element={<AdminRoute><ThemeProvider theme={theme}><ViewCourses /></ThemeProvider></AdminRoute>} />
            <Route path="/admin-panel" element={<AdminRoute><ThemeProvider theme={theme}><AdminPanel /></ThemeProvider></AdminRoute>} />
            <Route path="/bachelor-degree-with-honours" element={<AdminRoute><ThemeProvider theme={theme}><BachelorDegreeWithHonours /></ThemeProvider></AdminRoute>} />
            <Route path="/wh-major-details/:programId/:majorId" element={<AdminRoute><ThemeProvider theme={theme}><WHMajorDetails /></ThemeProvider></AdminRoute>} />
            <Route path="/view-wh-courses/:programId/:majorId" element={<AdminRoute><ThemeProvider theme={theme}><ViewWHCourses /></ThemeProvider></AdminRoute>} />
            <Route path="/add-bdwhp" element={<AdminRoute><ThemeProvider theme={theme}><AddBDWHP /></ThemeProvider></AdminRoute>} />
            <Route path="/wh-edit-major/:programId/:majorId" element={<AdminRoute><ThemeProvider theme={theme}><EditWHMajorDetails /></ThemeProvider></AdminRoute>} />
            <Route path="/md-major-details/:programId/:majorId" element={<AdminRoute><ThemeProvider theme={theme}><MDMajorDetails /></ThemeProvider></AdminRoute>} />
            <Route path="/add-mdp" element={<AdminRoute><ThemeProvider theme={theme}><AddMDP /></ThemeProvider></AdminRoute>} />
            <Route path="/view-md-courses/:programId/:majorId" element={<AdminRoute><ThemeProvider theme={theme}><ViewMDCourses /></ThemeProvider></AdminRoute>} />
            <Route path="/md-edit-major/:programId/:majorId" element={<AdminRoute><ThemeProvider theme={theme}><EditMDMajorDetails /></ThemeProvider></AdminRoute>} />
            <Route path="adminRegister" element={<AdminRoute><ThemeProvider theme={theme}><AdminRegister /></ThemeProvider></AdminRoute>} />
           
          </Routes>
        </div>
      </Router>
    </UserAuthProvider>
  );
}

// Custom ProtectedRoute component to handle authentication


export default App;
