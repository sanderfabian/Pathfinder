import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Sidebar from './Sidebar'; // Import the Sidebar component
import { collection, doc, getDoc, updateDoc,setDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { useUserAuth} from '../../Components/AuthContext';
import Grid from '@mui/material/Grid';

const AdminPanel = () => {
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { createUser } = useUserAuth();
    const [formData, setFormData] = useState({
        Username: '',
        Password: '',
        IsAdmin: true,
        UID: '',
        Email: ''
    });
    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError(null);
            const userCredential = await createUser(formData.Email, formData.Password);
            const user = userCredential.user;

            // Add user document to Firestore User collection
            const userRef = doc(firestore, 'User', user.uid);
            await setDoc(userRef, {
                Username: formData.Username,
                UID: user.uid,
                IsAdmin: true
            });
    
            // Redirect to dashboard after successful registration
            navigate('/admin-panel');
        } catch (error) {
            console.error('Error registering user:', error);
            setError('Failed to register user. Please try again.');
        }
    };
   


    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ width: `calc(100% - 240px)`, ml: '240px' }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        Administrator Mode
                    </Typography>
                </Toolbar>
            </AppBar>
            <Sidebar /> {/* Include the Sidebar component */}
            <Box
                component="main"
                sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, marginLeft: '0px' }}
            >
                <Toolbar />
                <Paper sx={{ p: 4 }}>
                    <Typography variant="h5" gutterBottom fontWeight="bold" mb={3}>
                        Register new Admin
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    id="Username"
                                    name="Username"
                                    label="Username"
                                    value={formData.Username}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="Email"
                                    name="Email"
                                    label="E-mail"
                                    value={formData.Email}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="Password"
                                    name="Password"
                                    label="Password"
                                    
                                    value={formData.Password}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                            </Grid>
                            
                            
                        </Grid>
                        <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
                            Create Admin
                        </Button>
                    </form>
                </Paper>
            </Box>
        </Box>
    );
};

export default AdminPanel;
