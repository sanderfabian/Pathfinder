import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Sidebar from './Sidebar'; // Import the Sidebar component
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const AdminPanel = () => {
    const [formData, setFormData] = useState({
        BoxColour: '',
        HomeParagraph: '',
        LogoImage: '',
        SideImage: '',
        TestimonialVideo: '',
        VideoLink: ''
    });
    const theme = createTheme({
        palette: {
          primary: {
            main: '#7100ff', 
          },
        },
      });
      

    useEffect(() => {
        const fetchHomepageData = async () => {
            try {
                const homepageDocRef = doc(firestore, 'Home', 'Information');
                const homepageDocSnap = await getDoc(homepageDocRef);
                if (homepageDocSnap.exists()) {
                    setFormData(homepageDocSnap.data());
                }
            } catch (error) {
                console.error('Error fetching homepage data:', error);
            }
        };

        fetchHomepageData();
    }, []);

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
            const homepageDocRef = doc(firestore, 'Home', 'Information');
            await updateDoc(homepageDocRef, formData);
            console.log('Homepage information updated successfully');
        } catch (error) {
            console.error('Error updating homepage information:', error);
        }
    };

    return (
        <ThemeProvider theme={theme}>
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
                        Homepage Settings
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    id="BoxColour"
                                    name="BoxColour"
                                    label="Box Colour"
                                    value={formData.BoxColour}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="HomeParagraph"
                                    name="HomeParagraph"
                                    label="Home Paragraph"
                                    value={formData.HomeParagraph}
                                    onChange={handleInputChange}
                                    fullWidth
                                    multiline
                                    rows={4}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id="LogoImage"
                                    name="LogoImage"
                                    label="Logo Image"
                                    value={formData.LogoImage}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id="SideImage"
                                    name="SideImage"
                                    label="Side Image"
                                    value={formData.SideImage}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id="TestimonialVideo"
                                    name="TestimonialVideo"
                                    label="Testimonial Video"
                                    value={formData.TestimonialVideo}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id="VideoLink"
                                    name="VideoLink"
                                    label="Video Link"
                                    value={formData.VideoLink}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                        <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
                            Save Changes
                        </Button>
                    </form>
                </Paper>
            </Box>
        </Box>
        </ThemeProvider>
    );
};

export default AdminPanel;
