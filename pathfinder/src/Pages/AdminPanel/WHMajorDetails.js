import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Sidebar from './Sidebar';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';

const WHMajorDetails = () => {
    const { programId, majorId } = useParams();
    const [majorData, setMajorData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMajorDetails = async () => {
            try {
                const majorCollectionRef = collection(firestore, 'BachelorDegreeWithHonours', programId, 'Major');
                const majorSnapshot = await getDocs(majorCollectionRef);

                const majors = majorSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                setMajorData(majors);
            } catch (error) {
                console.error('Error fetching major details:', error);
            }
        };

        fetchMajorDetails();
    }, [programId]);

    const columns: GridColDef[] = [
        { field: 'id', headerName: <div style={{ fontWeight: 'bold' }}>ID</div>, width: 150 },
        { field: 'Title', headerName: <div style={{ fontWeight: 'bold' }}>Title</div>, width: 150 },
        { field: 'ProgramCode', headerName: <div style={{ fontWeight: 'bold' }}>Program Code</div>, width: 120 },
        { field: 'FullTime', headerName: <div style={{ fontWeight: 'bold' }}>FullTime</div>, width: 100 },
        { field: 'PartTime', headerName: <div style={{ fontWeight: 'bold' }}>PartTime</div>, width: 100 },
        { field: 'Mode', headerName: <div style={{ fontWeight: 'bold' }}>Mode</div>, width: 120 },
        { field: 'Maximum1000LevelUnit', headerName: <div style={{ fontWeight: 'bold' }}>Max Level Unit</div>, type: 'number', width: 120 },
        { field: 'MinimumRequiredLevelUnit', headerName: <div style={{ fontWeight: 'bold' }}>Min Req Level Unit</div>, type: 'number', width: 150 },
        { field: 'RequiredElectiveUnit', headerName: <div style={{ fontWeight: 'bold' }}>Req Elective Unit</div>, type: 'number', width: 150 },
        { field: 'RequiredElectiveMajorUnit', headerName: <div style={{ fontWeight: 'bold' }}>Req Elective Major Unit</div>, type: 'number', width: 180 },
        { field: 'RequiredUnit', headerName: <div style={{ fontWeight: 'bold' }}>Req Unit</div>, type: 'number', width: 100 },
        {
            field: '.Courses',
            headerName: <div style={{ fontWeight: 'bold' }}>Courses</div>,
            width: 80,
            renderCell: (params) => (
                <div>
                    <VisibilityIcon
                        style={{ cursor: 'pointer', color: 'grey', marginLeft: 17 }}
                        onClick={() => handleViewCourses(params.row.id)}
                    />
                </div>
            ),
        },
        {
            field: 'actions',
            headerName: <div style={{ fontWeight: 'bold' }}>Actions</div>,
            width: 80,
            renderCell: (params) => (
                <div>
                    <EditIcon
                        style={{ cursor: 'pointer', marginRight: 8 }}
                        onClick={() => handleEdit(params.row.id, params.row)}
                    />
                    <DeleteForeverOutlinedIcon
                        style={{ cursor: 'pointer', color: 'red' }}
                        onClick={() => handleDelete(params.row.id)}
                    />
                </div>
            ),
        },
    ];

    const handleEdit = (id, rowData) => {
        navigate(`/wh-edit-major/${programId}/${id}`, { state: { majorDetails: rowData } });
    };

    const handleViewCourses = (id) => {
        navigate(`/view-wh-courses/${programId}/${id}`);
    };

    const handleDelete = async (id) => {
        try {
            const majorDocRef = doc(firestore, 'BachelorDegreeWithHonours', programId, 'Major', id);
            const subcollections = ['CoreCourses', 'ElectiveCourses', 'ElectiveMajorCourses', 'MajorCourses'];
            await Promise.all(subcollections.map(async (subcollection) => {
                const subcollectionRef = collection(firestore, 'BachelorDegreeWithHonours', programId, 'Major', id, subcollection);
                const subcollectionDocs = await getDocs(subcollectionRef);
                await Promise.all(subcollectionDocs.docs.map(async (subcollectionDoc) => {
                    const subcollectionDocRef = doc(subcollectionRef, subcollectionDoc.id);
                    await deleteDoc(subcollectionDocRef);
                }));
            }));
            await deleteDoc(majorDocRef);
            setMajorData((prevMajorData) => prevMajorData.filter((major) => major.id !== id));

            console.log('Major document and its subcollections deleted successfully');
        } catch (error) {
            console.error('Error deleting major document:', error);
        }
    };
    const goBack = () => {
        navigate(`/mprograms`);
    };

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ flexGrow: 1, marginLeft: 0, padding: '16px' }}>
                <Paper elevation={3} style={{ padding: '16px', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '16px' }}>
                    <Typography variant="h6" gutterBottom>
                        Major Details
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={12}>
                            <DataGrid
                                rows={majorData}
                                columns={columns}
                                pageSize={10}
                                checkboxSelection={false}
                                disableSelectionOnClick
                            />
                        </Grid>
                    </Grid>
                </Paper>
                <Button variant="outlined" color="secondary" onClick={goBack}>
                    Back
                </Button>
            </div>
        </div>
    );
};

export default WHMajorDetails;
