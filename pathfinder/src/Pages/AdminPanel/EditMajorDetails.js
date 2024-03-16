import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';
import Sidebar from './Sidebar'; // Import Sidebar component

const EditMajorDetails = () => {
    const { programId, majorId } = useParams();
    const navigate = useNavigate();
    const [majorDetails, setMajorDetails] = useState({
        Title: '',
        ProgramCode: '',
        FullTime: '',
        PartTime: '',
        Mode: '',
        Maximum1000LevelUnit: '',
        MinimumRequiredLevelUnit: '',
        RequiredElectiveUnit: '',
        RequiredElectiveMajorUnit: '',
        RequiredUnit: '',
    });

    useEffect(() => {
        const fetchMajorDetails = async () => {
            try {
                const majorDocRef = doc(firestore, 'BachelorDegree', programId, 'Major', majorId);
                const majorDocSnap = await getDoc(majorDocRef);
                if (majorDocSnap.exists()) {
                    setMajorDetails(majorDocSnap.data());
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error fetching major details:', error);
            }
        };

        fetchMajorDetails();
    }, [programId, majorId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMajorDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleEdit = async () => {
        try {
            // Convert numeric fields to numbers
            const updatedDetails = {
                ...majorDetails,
                Maximum1000LevelUnit: parseFloat(majorDetails.Maximum1000LevelUnit),
                MinimumRequiredLevelUnit: parseFloat(majorDetails.MinimumRequiredLevelUnit),
                RequiredElectiveUnit: parseFloat(majorDetails.RequiredElectiveUnit),
                RequiredElectiveMajorUnit: parseFloat(majorDetails.RequiredElectiveMajorUnit),
                RequiredUnit: parseFloat(majorDetails.RequiredUnit),
            };

            // Update Firestore document
            const majorDocRef = doc(firestore, 'BachelorDegree', programId, 'Major', majorId);
            await updateDoc(majorDocRef, updatedDetails);
            console.log('Major details updated successfully');
            navigate(-1);
        } catch (error) {
            console.error('Error updating major details:', error);
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ flexGrow: 1, padding: '16px' }}>
                <Paper elevation={3} style={{ padding: '16px', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '16px' }}>
                    <Typography variant="h6" gutterBottom>
                        Edit Major Details
                    </Typography>
                    <Grid container spacing={2}>
                        {/* Input fields */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Program Code"
                                name="ProgramCode"
                                value={majorDetails.ProgramCode}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Full Time"
                                name="FullTime"
                                value={majorDetails.FullTime}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Part Time"
                                name="PartTime"
                                value={majorDetails.PartTime}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Mode"
                                name="Mode"
                                value={majorDetails.Mode}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Max Level Unit"
                                name="Maximum1000LevelUnit"
                                value={majorDetails.Maximum1000LevelUnit}
                                onChange={handleInputChange}
                                type="number"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Min Req Level Unit"
                                name="MinimumRequiredLevelUnit"
                                value={majorDetails.MinimumRequiredLevelUnit}
                                onChange={handleInputChange}
                                type="number"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Req Elective Unit"
                                name="RequiredElectiveUnit"
                                value={majorDetails.RequiredElectiveUnit}
                                onChange={handleInputChange}
                                type="number"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Req Elective Major Unit"
                                name="RequiredElectiveMajorUnit"
                                value={majorDetails.RequiredElectiveMajorUnit}
                                onChange={handleInputChange}
                                type="number"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Req Unit"
                                name="RequiredUnit"
                                value={majorDetails.RequiredUnit}
                                onChange={handleInputChange}
                                type="number"
                            />
                        </Grid>
                        <Grid item xs={12} style={{ height: '20px' }}></Grid>
                    </Grid>
                    <Button variant="contained" color="primary" onClick={handleEdit}>
                        Save
                    </Button>
                    <Button variant="outlined" onClick={handleCancel} style={{ marginLeft: '8px' }}>
                        Cancel
                    </Button>
                </Paper>
            </div>
        </div>
    );
};

export default EditMajorDetails;
