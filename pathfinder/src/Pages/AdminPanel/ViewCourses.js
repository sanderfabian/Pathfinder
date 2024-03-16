import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { DataGrid, GridToolbarContainer } from '@mui/x-data-grid';
import Sidebar from './Sidebar';
import { useParams, useNavigate } from 'react-router-dom';
import { getDocs, collection, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const ViewCourses = () => {
    const { programId, majorId } = useParams();
    const navigate = useNavigate();
    const [coreCourses, setCoreCourses] = useState([]);
    const [electiveCourses, setElectiveCourses] = useState([]);
    const [electiveMajorCourses, setElectiveMajorCourses] = useState([]);
    const [majorCourses, setMajorCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedSubcollection, setSelectedSubcollection] = useState('');
    const [availableCourses, setAvailableCourses] = useState([]);

    const fetchCourses = async () => {
        try {
            const coreCoursesRef = collection(firestore, 'BachelorDegree', programId, 'Major', majorId, 'CoreCourses');
            const electiveCoursesRef = collection(firestore, 'BachelorDegree', programId, 'Major', majorId, 'ElectiveCourses');
            const electiveMajorCoursesRef = collection(firestore, 'BachelorDegree', programId, 'Major', majorId, 'ElectiveMajorCourses');
            const majorCoursesRef = collection(firestore, 'BachelorDegree', programId, 'Major', majorId, 'MajorCourses');

            const extractData = (snapshot) => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            const coreCoursesSnapshot = await getDocs(coreCoursesRef);
            const electiveCoursesSnapshot = await getDocs(electiveCoursesRef);
            const electiveMajorCoursesSnapshot = await getDocs(electiveMajorCoursesRef);
            const majorCoursesSnapshot = await getDocs(majorCoursesRef);

            setCoreCourses(extractData(coreCoursesSnapshot));
            setElectiveCourses(extractData(electiveCoursesSnapshot));
            setElectiveMajorCourses(extractData(electiveMajorCoursesSnapshot));
            setMajorCourses(extractData(majorCoursesSnapshot));
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const fetchAvailableCourses = async () => {
        try {
            const coursesSnapshot = await getDocs(collection(firestore, 'Course'));
            const coursesData = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAvailableCourses(coursesData);
        } catch (error) {
            console.error('Error fetching available courses:', error);
        }
    };

    useEffect(() => {
        fetchCourses();
        fetchAvailableCourses();
    }, [programId, majorId]);

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '500px',
        position: 'relative',
    };

    const tableContainerStyle = {
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
    };

    const tableStyle = {
        flex: '1 1 300px',
        maxWidth: '350px',
        height: '600px',
        marginBottom: '20px',
        marginTop: '25px',
        overflow: 'auto',
    };

    const CustomToolbar = () => (
        <GridToolbarContainer>
        </GridToolbarContainer>
    );

    const handleDeleteCourse = async (courseId, subcollection) => {
        try {
            const courseRef = collection(firestore, 'BachelorDegree', programId, 'Major', majorId, subcollection);
            await deleteDoc(doc(courseRef, courseId));
            // Fetch courses again after deletion
            fetchCourses();
        } catch (error) {
            console.error('Error deleting course:', error);
        }
    };

    const handleAddCourse = async () => {
        try {
            if (!selectedCourse || !selectedSubcollection) {
                console.error('Please select a course and a subcollection');
                return;
            }

            const courseRef = collection(firestore, 'BachelorDegree', programId, 'Major', majorId, selectedSubcollection);
            const courseDocumentName = selectedCourse;
            const courseDocumentRef = doc(firestore, 'Course', selectedCourse); // Create Firestore reference for the course document
            await setDoc(doc(courseRef, courseDocumentName), { Refer: courseDocumentRef });
            fetchCourses();
        } catch (error) {
            console.error('Error adding course:', error);
        }
    };

    const renderTable = (title, data, subcollection) => (
        <div style={tableStyle}>
            <Typography variant="subtitle1" gutterBottom>
                {title}
            </Typography>
            <DataGrid
                rows={data.slice(0, 5)}
                columns={[
                    { field: 'id', headerName: <div style={{ fontWeight: 'bold' }}>ID</div>, width: 200 },
                    {
                        field: 'delete',
                        headerName: 'Delete',
                        sortable: false,
                        width: 100,
                        renderCell: (params) => (
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => handleDeleteCourse(params.row.id, subcollection)}
                            >
                                Delete
                            </Button>
                        ),
                    },
                ]}
                components={{ Toolbar: CustomToolbar }}
                checkboxSelection={false}
                disableSelectionOnClick
                pagination={false}
            />
        </div>
    );

    const goBack = () => {
        navigate(`/major-details/${programId}/${majorId}`);
    };

    return (
        <div style={{ display: 'flex' , overflowX:"hidden"}}>
            <Sidebar />
            <div style={{ flexGrow: 1, marginLeft: 0, padding: '16px', ...containerStyle }}>
                <Paper elevation={3} style={{ padding: '16px', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '16px' }}>
                    <Typography variant="h6" gutterBottom>
                        View Courses
                    </Typography>
                    {/* Option to add a course */}
                    <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center' }}>
                        <Select
                            value={selectedSubcollection}
                            onChange={(e) => setSelectedSubcollection(e.target.value)}
                            style={{ marginRight: '10px', minWidth: '200px' }} 
                        >
                            <MenuItem value="">Select Subcollection</MenuItem>
                            <MenuItem value="CoreCourses">Core Courses</MenuItem>
                            <MenuItem value="ElectiveCourses">Elective Courses</MenuItem>
                            <MenuItem value="ElectiveMajorCourses">Elective Major Courses</MenuItem>
                            <MenuItem value="MajorCourses">Major Courses</MenuItem>
                        </Select>
                        <Select
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            style={{ minWidth: '200px' }}
                        >
                            <MenuItem value="">Select Course</MenuItem>
                            {availableCourses.map(course => (
                                <MenuItem key={course.id} value={course.id}>{course.id}</MenuItem>
                            ))}
                        </Select>

                        <Button variant="contained" color="primary" onClick={handleAddCourse} style={{ marginLeft: '10px' }}>
                            Add
                        </Button>
                    </div>
                    <div style={tableContainerStyle}>
                        {renderTable('Core Courses', coreCourses, 'CoreCourses')}
                        {renderTable('Elective Courses', electiveCourses, 'ElectiveCourses')}
                        {renderTable('Elective Major Courses', electiveMajorCourses, 'ElectiveMajorCourses')}
                        {renderTable('Major Courses', majorCourses, 'MajorCourses')}
                    </div>
                </Paper>
                <Button variant="outlined" color="secondary" onClick={goBack}>
                    Back
                </Button>
            </div>
        </div>
    );
};


export default ViewCourses;
