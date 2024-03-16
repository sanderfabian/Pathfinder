import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebase';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';


const AddBDP = () => {
    const [newProgramTitle, setNewProgramTitle] = useState('');
    const [programCode, setProgramCode] = useState('');
    const [fullTime, setFullTime] = useState('');
    const [partTime, setPartTime] = useState('');
    const [mode, setMode] = useState('');
    const [max1000LevelUnit, setMax1000LevelUnit] = useState(0);
    const [minRequiredLevelUnit, setMinRequiredLevelUnit] = useState(0);
    const [requiredElectiveUnit, setRequiredElectiveUnit] = useState(0);
    const [requiredElectiveMajorUnit, setRequiredElectiveMajorUnit] = useState(0);
    const [requiredUnit, setRequiredUnit] = useState(0);
    const [majorTitle, setMajorTitle] = useState('');
    const [availableCourses, setAvailableCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [addedCourses, setAddedCourses] = useState({
        CoreCourses: [],
        ElectiveCourses: [],
        ElectiveMajorCourses: [],
        MajorCourses: [],
    });
    const [selectedAction] = useState('add');
    const [selectedSubcollection, setSelectedSubcollection] = useState('CoreCourses');
    const subcollections = ['CoreCourses', 'ElectiveCourses', 'ElectiveMajorCourses', 'MajorCourses'];
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAvailableCourses = async () => {
            try {
                const coursesSnapshot = await getDocs(collection(firestore, 'Course')); // Course collection 
                const coursesData = coursesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                console.log('Available Courses:', coursesData); // Line for debugging
                setAvailableCourses(coursesData);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchAvailableCourses();
    }, []);

    const createSubcollections = async (programId, majorDocumentName) => {
        try {
            const subcollections = ['CoreCourses', 'ElectiveCourses', 'ElectiveMajorCourses', 'MajorCourses'];  // Loop through each subcollection and create it with the added courses
            await Promise.all(subcollections.map(async (subcollection) => {
                const subcollectionRef = collection(firestore, 'BachelorDegree', programId, 'Major', majorDocumentName, subcollection);  // Get the courses from addedCourses state
                const coursesToAdd = addedCourses[subcollection];  // Loop through courses and add them to the subcollection
                await Promise.all(coursesToAdd.map(async (course) => {
                    await setDoc(doc(subcollectionRef, course.courseCode), { Refer: course.Refer });  // Use courseCode as the document name and store only the 'Refer' field
                }));
            }));

            console.log('Subcollections created successfully with added courses');
        } catch (error) {
            console.error('Error creating subcollections:', error);
        }
    };

    const addCourse = async () => {
        const updatedCourses = { ...addedCourses };
        const courseId = selectedCourse;
        const courseRef = doc(firestore, 'Course', courseId); // Create Firestore reference for the course

        updatedCourses[selectedSubcollection].push({ courseCode: courseId, Refer: courseRef });
        setAddedCourses(updatedCourses);
        setSelectedCourse('');
    };

    const removeCourse = (subcollection, index) => {
        const updatedCourses = { ...addedCourses };
        updatedCourses[subcollection].splice(index, 1);
        setAddedCourses(updatedCourses);
    };

    const createProgramDocument = async () => {
        try {
            const programId = newProgramTitle.replace(/\s/g, '');  // Remove spaces from the program title to generate the program ID
            const programDocRef = doc(firestore, 'BachelorDegree', programId);  // Create the program document with the program ID
            const programDocument = {
                Title: newProgramTitle,
            };
            await setDoc(programDocRef, programDocument);  // Add the program document
            const majorId = majorTitle.replace(/\s/g, '');  // Remove spaces from the major title to generate the major ID
            const majorCollection = collection(firestore, 'BachelorDegree', programId, 'Major');  // Create Major sub-collection
            const majorDocument = {
                Title: majorTitle,
                ProgramCode: programCode,
                FullTime: fullTime,
                PartTime: partTime,
                Mode: mode,
                Maximum1000LevelUnit: max1000LevelUnit,
                MinimumRequiredLevelUnit: minRequiredLevelUnit,
                RequiredElectiveUnit: requiredElectiveUnit,
                RequiredElectiveMajorUnit: requiredElectiveMajorUnit,
                RequiredUnit: requiredUnit,
            };
            
            await setDoc(doc(majorCollection, majorId), majorDocument);  // Add the Major document to the Major sub-collection using majorId as the document ID
            await createSubcollections(programId, majorId); // Create subcollections inside the Major collection
            console.log('Program and subcollections created successfully');
            navigate(`/major-details/${programId}/${majorId}`);
        } catch (error) {
            console.error('Error creating Major document:', error);
        }
    };

    

    return (
        <div style={{ display: 'flex' , overflowX:"hidden"}}>
            <Sidebar />
            <div style={{ flexGrow: 1, marginLeft: 0, padding: '16px' }}>
                <Paper elevation={3} style={{ padding: '16px', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '16px' }}>
                    <Typography variant="h6" gutterBottom>
                        Bachelor Degree Program
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Program Title"
                                variant="outlined"
                                value={newProgramTitle}
                                onChange={(e) => setNewProgramTitle(e.target.value)}
                                fullWidth
                                style={{ marginBottom: '1rem' }}
                            />
                        </Grid>
                        </Grid>
                </Paper>
                <Paper elevation={3} style={{ padding: '16px', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '16px' }}>
                    <Typography variant="h6" gutterBottom>
                        Major Details
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Major Title"
                                variant="outlined"
                                value={majorTitle}
                                onChange={(e) => setMajorTitle(e.target.value)}
                                fullWidth
                                style={{ marginBottom: '1rem' }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Program Code"
                                variant="outlined"
                                value={programCode}
                                onChange={(e) => setProgramCode(e.target.value)}
                                fullWidth
                                style={{ marginBottom: '1rem' }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Full Time"
                                variant="outlined"
                                value={fullTime}
                                onChange={(e) => setFullTime(e.target.value)}
                                fullWidth
                                style={{ marginBottom: '1rem' }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Part Time"
                                variant="outlined"
                                value={partTime}
                                onChange={(e) => setPartTime(e.target.value)}
                                fullWidth
                                style={{ marginBottom: '1rem' }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Mode"
                                variant="outlined"
                                value={mode}
                                onChange={(e) => setMode(e.target.value)}
                                fullWidth
                                style={{ marginBottom: '1rem' }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Maximum 1000 Level Unit"
                                variant="outlined"
                                type="number"
                                value={max1000LevelUnit}
                                onChange={(e) => setMax1000LevelUnit(Number(e.target.value))}
                                fullWidth
                                style={{ marginBottom: '1rem' }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Minimum Required Level Unit"
                                variant="outlined"
                                type="number"
                                value={minRequiredLevelUnit}
                                onChange={(e) => setMinRequiredLevelUnit(Number(e.target.value))}
                                fullWidth
                                style={{ marginBottom: '1rem' }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Required Elective Unit"
                                variant="outlined"
                                type="number"
                                value={requiredElectiveUnit}
                                onChange={(e) => setRequiredElectiveUnit(Number(e.target.value))}
                                fullWidth
                                style={{ marginBottom: '1rem' }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Required Elective Major Unit"
                                variant="outlined"
                                type="number"
                                value={requiredElectiveMajorUnit}
                                onChange={(e) => setRequiredElectiveMajorUnit(Number(e.target.value))}
                                fullWidth
                                style={{ marginBottom: '1rem' }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Required Unit"
                                variant="outlined"
                                type="number"
                                value={requiredUnit}
                                onChange={(e) => setRequiredUnit(Number(e.target.value))}
                                fullWidth
                                style={{ marginBottom: '1rem' }}
                            />
                        </Grid>
                    </Grid>
                </Paper>
                <Paper elevation={3} style={{ padding: '16px', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '16px' }}>
                    <Typography variant="h6" gutterBottom>
                        Add Courses to Subcollections
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                select
                                label="Select Subcollection"
                                value={selectedSubcollection}
                                onChange={(e) => setSelectedSubcollection(e.target.value)}
                                fullWidth
                                style={{ marginBottom: '1rem' }}
                            >
                                {subcollections.map((subcollection) => (
                                    <MenuItem key={subcollection} value={subcollection}>
                                        {subcollection}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Select Course"
                                variant="outlined"
                                select
                                fullWidth
                                style={{ marginBottom: '1rem' }}
                                value={selectedCourse}
                                onChange={(e) => setSelectedCourse(e.target.value)}
                            > 
                                <MenuItem value="">Select a course</MenuItem>
                                {availableCourses.map((course) => (
                                    <MenuItem key={course.id} value={course.id}>
                                        {course.id}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Button variant="contained" onClick={addCourse}>
                                {selectedAction === 'add' ? 'Add Course' : 'Remove Course'}
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                    {subcollections.map((subcollection) => (
                        <Paper key={subcollection} elevation={3} style={{ flex: 1, padding: '16px', border: '1px solid #ccc', borderRadius: '8px' }}>
                            <Typography variant="h6" gutterBottom>
                                {`${subcollection}`}
                            </Typography>
                            <List subheader={<ListSubheader>Courses</ListSubheader>}>
                                {addedCourses[subcollection].map((course, index) => (
                                    <ListItem key={index}>
                                        <ListItemText primary={course.courseCode} />
                                        <IconButton
                                            edge="end"
                                            aria-label="delete"
                                            onClick={() => removeCourse(subcollection, index)}
                                            style={{ color: 'red' }} // Make the button red
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    ))}
                </div>
                <Button variant="contained" onClick={createProgramDocument} style={{ marginRight: '8px' }}>
                    Create Program
                </Button>
                <Button variant="outlined" onClick={() => navigate(-1)}>
                    Back
                </Button>
            </div>
        </div>
    );
};


export default AddBDP;