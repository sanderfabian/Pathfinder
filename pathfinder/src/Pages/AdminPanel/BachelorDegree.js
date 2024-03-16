import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { firestore } from '../../firebase';
import { deleteDoc, collection, getDocs, doc } from 'firebase/firestore';
import { DataGrid, GridColDef, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import { useParams } from 'react-router-dom';

const CustomToolbar = () => {
    return (
        <GridToolbarContainer>
            <GridToolbarExport />
        </GridToolbarContainer>
    );
};

const BachelorDegree = () => {
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const { majorId } = useParams();

    const handleViewMajor = (programId) => {
        navigate(`/major-details/${programId}/${majorId}`);
    };

    const fetchData = async () => {
        try {
            const programCollection = collection(firestore, 'BachelorDegree');
            const programSnapshot = await getDocs(programCollection);
            if (programSnapshot.size > 0) {
                const programs = programSnapshot.docs.map((programDoc) => {
                    const programData = { id: programDoc.id, ...programDoc.data() };
                    return {
                        ...programData,
                        viewMajor: (
                            <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                                onClick={() => handleViewMajor(programData.id)}
                            >
                                View Major
                            </Button>
                        ),
                    };
                });

                setData(programs);
            } else {
                console.log('No programs found');
                setData([]);
            }
        } catch (error) {
            console.error('Error fetching programs: ', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const deleteProgram = async (programId) => {
        try {
            const programDocRef = doc(firestore, 'BachelorDegree', programId);  // Reference to the program document
            const majorCollectionRef = collection(firestore, 'BachelorDegree', programId, 'Major');  // Reference to the Major subcollection
            const majorDocs = await getDocs(majorCollectionRef); // Get all documents in the Major subcollection             
            const deleteMajorPromises = majorDocs.docs.map(async (majorDoc) => {  // Delete each document inside the Major subcollection
                const majorDocRef = doc(majorCollectionRef, majorDoc.id);
                const subcollections = ['CoreCourses', 'ElectiveCourses', 'ElectiveMajorCourses', 'MajorCourses'];
                await Promise.all(subcollections.map(async (subcollection) => {
                    const subcollectionRef = collection(firestore, 'BachelorDegree', programId, 'Major', majorDoc.id, subcollection);
                    const subcollectionDocs = await getDocs(subcollectionRef);
                    const deleteSubcollectionPromises = subcollectionDocs.docs.map(async (subcollectionDoc) => {  // Delete each document inside the subcollection
                        const subcollectionDocRef = doc(subcollectionRef, subcollectionDoc.id);
                        await deleteDoc(subcollectionDocRef);
                    });
                    await Promise.all(deleteSubcollectionPromises); // Wait for all subcollection documents to be deleted
                }));
                await deleteDoc(majorDocRef);
            });
            await Promise.all(deleteMajorPromises);
            await deleteDoc(programDocRef);
            console.log('Program and its subcollections deleted successfully');

            fetchData(); // Refresh the data after deletion
        } catch (error) {
            console.error('Error deleting program and subcollections:', error);
        }
    };

    const handleDeleteProgram = (programId) => {
        deleteProgram(programId);
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 400 },
        {
            field: 'Title',
            headerName: 'Title',
            width: 800,
            editable: true,
        },
        {
            field: 'viewMajor',
            headerName: 'View Major',
            width: 250,
            renderCell: (params) => params.value,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            renderCell: (params) => (
                <div>
                    <DeleteForeverOutlinedIcon
                        style={{ cursor: 'pointer', color: 'red' }}
                        onClick={() => handleDeleteProgram(params.id)}
                    />
                </div>
            ),
        },
    ];

    return (
        <div style={{ height: 655, width: '100%' }}>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/add-bdp')}
                style={{ marginBottom: '16px', marginTop: '16px' }}
            >
                Create Program
            </Button>
            <DataGrid
                rows={data}
                columns={columns}
                pageSize={5}
                checkboxSelection
                components={{
                    Toolbar: CustomToolbar,
                }}
            />
        </div>
    );
};

export default BachelorDegree;
