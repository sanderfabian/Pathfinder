import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import Sidebar from './Sidebar';
import AdminLayout from './AdminLayout';

const MCourses = () => {
    const [coursesData, setCoursesData] = useState([]);
    const navigate = useNavigate();
    const coursesCollection = collection(firestore, 'Course');

    const fetchData = async () => {
        try {
            const snapshot = await getDocs(coursesCollection);
            const courses = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setCoursesData(courses);
        } catch (error) {
            console.error('Error fetching courses from Firestore:', error);
        }
    };

    useEffect(() => {
        fetchData(); // Fetch data only when the component mounts
    }, []);

    const handleEditCourse = (courseId) => {
        const courseToEdit = coursesData.find((course) => course.id === courseId);

        if (courseToEdit) {
            navigate(`/add-course/${courseId}`, { state: { courseData: courseToEdit, from: '/mcourses' } });
        }
    };


    const handleDeleteCourse = async (courseId) => {
        try {
            const courseDocRef = doc(coursesCollection, courseId);
            await deleteDoc(courseDocRef);

            fetchData();
        } catch (error) {
            console.error('Error deleting course from Firestore:', error);
        }
    };

    const columns = [
        { field: 'id', headerName: <div style={{ fontWeight: 'bold' }}>ID</div>, width: 140 },
        { field: 'Title', headerName: <div style={{ fontWeight: 'bold' }}>Title</div>, width: 220 },
        { field: 'CourseCode', headerName: <div style={{ fontWeight: 'bold' }}>Course Code</div>, width: 140 },
        { field: 'Information', headerName: <div style={{ fontWeight: 'bold' }}>Information</div>, width: 100 },
        { field: 'Level', headerName: <div style={{ fontWeight: 'bold' }}>Level</div>, type: 'number', width: 100 },
        { field: 'Unit', headerName: <div style={{ fontWeight: 'bold' }}>Unit</div>, type: 'number', width: 100 },
        { field: 'RequiredUnit', headerName: <div style={{ fontWeight: 'bold' }}>Req Unit</div>, type: 'number', width: 110 },
        { field: 'OptionalPrerequisiteNumber', headerName: <div style={{ fontWeight: 'bold' }}>OP Number</div>, type: 'number', width: 130 },
        { field: 'CompulsoryPrerequisite', headerName: <div style={{ fontWeight: 'bold' }}>Compulsory Prerequisite</div>, width: 180 },
        { field: 'OptionalPrerequisite', headerName: <div style={{ fontWeight: 'bold' }}>Optional Prerequisite</div>, width: 180 },
        { field: 'NotAllowed', headerName: <div style={{ fontWeight: 'bold' }}>NA</div>, width: 100 },
        {
            field: 'actions',
            headerName: <div style={{ fontWeight: 'bold' }}>Actions</div>,
            width: 80,
            renderCell: (params) => (
                <div>
                    <EditIcon
                        style={{ cursor: 'pointer', marginRight: 8 }}
                        onClick={() => handleEditCourse(params.id)}
                    />
                    <DeleteForeverOutlinedIcon
                        style={{ cursor: 'pointer', color: 'red' }}
                        onClick={() => handleDeleteCourse(params.id)}
                    />
                </div>
            ),
        },
    ];

    const handleNavigateToAddCourse = () => {
        navigate('/add-course', { state: { from: '/mcourses' } });
    };

    return (
        <div style={{ height: 'calc(100vh - 130px)', width: '100%', position: 'relative', backgroundColor: 'white', marginLeft: '240px', marginTop: '80px' }}>
            <AdminLayout/>
            <Sidebar />
            <div style={{ flexGrow: 1, paddingLeft: '20px', paddingRight: '20px' }}>
            <DataGrid
                rows={coursesData}
                columns={columns}
                pageSize={5}
                checkboxSelection
                components={{
                    Toolbar: () => (
                        <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleNavigateToAddCourse}
                                >
                                    Add Course
                                </Button>
                            </div>
                        </div>
                    ),
                }}
            />
            </div>
        </div>
    );
};

export default MCourses;