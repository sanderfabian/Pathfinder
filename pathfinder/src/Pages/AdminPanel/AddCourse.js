import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, setDoc, collection, getDoc, updateDoc } from 'firebase/firestore';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { firestore } from '../../firebase';
import Sidebar from './Sidebar';
import './Style.css';

function AddCourse() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const coursesCollection = collection(firestore, 'Course');
    const [title, setTitle] = useState('');
    const [courseCode, setCourseCode] = useState('');
    const [information, setInformation] = useState('');
    const [level, setLevel] = useState('');
    const [unit, setUnit] = useState('');
    const [requiredUnit, setRequiredUnit] = useState('');
    const [optionalPrerequisiteNumber, setOptionalPrerequisiteNumber] = useState('');
    const [compulsoryPrerequisites, setCompulsoryPrerequisites] = useState(['']);
    const [optionalPrerequisites, setOptionalPrerequisites] = useState(['']);
    const [notAllowedFields, setNotAllowedFields] = useState(['']);

    const navigateBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        if (courseId) {
            loadCourseData();
        }
    }, [courseId]);

    const loadCourseData = async () => {
        try {
            const docSnap = await getDoc(doc(coursesCollection, courseId));
            if (docSnap.exists()) {
                const data = docSnap.data();
                setTitle(data.Title || '');
                setCourseCode(data.CourseCode || '');
                setInformation(data.Information || '');
                setLevel(data.Level || '');
                setUnit(data.Unit || '');
                setRequiredUnit(data.RequiredUnit || '');
                setOptionalPrerequisiteNumber(data.OptionalPrerequisiteNumber || '');
                setCompulsoryPrerequisites(data.CompulsoryPrerequisite || ['']);
                setOptionalPrerequisites(data.OptionalPrerequisite || ['']);
                setNotAllowedFields(data.NotAllowed || ['']);
            }
        } catch (error) {
            console.error('Error loading course data:', error);
        }
    };


    const handleCreate = async () => {
        try {
            const courseDocRef = doc(coursesCollection, courseCode);

            await setDoc(courseDocRef, {
                Title: title,
                CourseCode: courseCode,
                Information: information,
                Level: Number(level),
                Unit: Number(unit),
                RequiredUnit: Number(requiredUnit),
                OptionalPrerequisiteNumber: Number(optionalPrerequisiteNumber),
                CompulsoryPrerequisite: compulsoryPrerequisites,
                OptionalPrerequisite: optionalPrerequisites,
                NotAllowed: notAllowedFields
            });

            // Clear the input fields after adding the course
            setTitle('');
            setCourseCode('');
            setInformation('');
            setLevel('');
            setUnit('');
            setRequiredUnit('');
            setOptionalPrerequisiteNumber('');
            setCompulsoryPrerequisites(['']);
            setOptionalPrerequisites(['']);
            setNotAllowedFields(['']);
            navigate(-1);

        } catch (error) {
            console.error('Error adding course:', error);
        }
    };

    const handleAddCompulsoryPrerequisite = () => {
        setCompulsoryPrerequisites(prevState => [...prevState, '']);
    };

    const handleAddOptionalPrerequisite = () => {
        setOptionalPrerequisites(prevState => [...prevState, '']);
    };

    const handleAddField = () => {
        setNotAllowedFields(prevState => [...prevState, '']);
    };

    const handleRemoveCompulsoryPrerequisite = (index) => {
        setCompulsoryPrerequisites(prevState => prevState.filter((_, i) => i !== index));
    };

    const handleRemoveOptionalPrerequisite = (index) => {
        setOptionalPrerequisites(prevState => prevState.filter((_, i) => i !== index));
    };

    const handleRemoveField = (index) => {
        setNotAllowedFields(prevState => prevState.filter((_, i) => i !== index));
    };

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div className="form-container" style={{ width: '60%', margin: '50px auto', padding: '50px', boxShadow: '0 6px 10px rgba(0, 0, 0, 0.5)', borderRadius: '10px', backgroundColor: 'white' }}>
                <h2>Course</h2>
                <form>
                    <TextField label="Title" variant="outlined" margin="normal" fullWidth value={title} onChange={(e) => setTitle(e.target.value)} />
                    <TextField label="Course Code" variant="outlined" margin="normal" fullWidth value={courseCode} onChange={(e) => setCourseCode(e.target.value)} />
                    <TextField label="Information" variant="outlined" margin="normal" fullWidth value={information} onChange={(e) => setInformation(e.target.value)} />
                    <TextField label="Level" variant="outlined" margin="normal" type="number" fullWidth value={level} onChange={(e) => setLevel(e.target.value)} />
                    <TextField label="Unit" variant="outlined" margin="normal" type="number" fullWidth value={unit} onChange={(e) => setUnit(e.target.value)} />
                    <TextField label="Required Unit" variant="outlined" margin="normal" type="number" fullWidth value={requiredUnit} onChange={(e) => setRequiredUnit(e.target.value)} />
                    <TextField label="Optional Prerequisite Number" variant="outlined" margin="normal" type="number" fullWidth value={optionalPrerequisiteNumber} onChange={(e) => setOptionalPrerequisiteNumber(e.target.value)} />

                    {compulsoryPrerequisites.map((prerequisite, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                            <TextField
                                label={`Compulsory Prerequisite ${index + 1}`}
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                value={prerequisite}
                                onChange={(e) => {
                                    const newPrerequisites = [...compulsoryPrerequisites];
                                    newPrerequisites[index] = e.target.value;
                                    setCompulsoryPrerequisites(newPrerequisites);
                                }}
                            />
                            <Button color="secondary" onClick={() => handleRemoveCompulsoryPrerequisite(index)}>
                                <DeleteForeverIcon style={{ color: 'red' }} />
                            </Button>
                        </div>
                    ))}
                    <Button variant="outlined" onClick={handleAddCompulsoryPrerequisite} style={{ marginBottom: '16px' }}>
                        <AddIcon />
                    </Button>

                    {optionalPrerequisites.map((prerequisite, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                            <TextField
                                label={`Optional Prerequisite ${index + 1}`}
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                value={prerequisite}
                                onChange={(e) => {
                                    const newPrerequisites = [...optionalPrerequisites];
                                    newPrerequisites[index] = e.target.value;
                                    setOptionalPrerequisites(newPrerequisites);
                                }}
                            />
                            <Button color="secondary" onClick={() => handleRemoveOptionalPrerequisite(index)}>
                                <DeleteForeverIcon style={{ color: 'red' }} />
                            </Button>
                        </div>
                    ))}
                    <Button variant="outlined" onClick={handleAddOptionalPrerequisite} style={{ marginBottom: '16px' }}>
                        <AddIcon />
                    </Button>

                    {notAllowedFields.map((field, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                            <TextField
                                label={`Not Allowed ${index + 1}`}
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                value={field}
                                onChange={(e) => {
                                    const newFields = [...notAllowedFields];
                                    newFields[index] = e.target.value;
                                    setNotAllowedFields(newFields);
                                }}
                            />
                            <Button color="secondary" onClick={() => handleRemoveField(index)}>
                                <DeleteForeverIcon style={{ color: 'red' }} />
                            </Button>
                        </div>
                    ))}
                    <Button variant="outlined" onClick={handleAddField} style={{ marginBottom: '16px' }}>
                        <AddIcon />
                    </Button>

                    <Button variant="contained" color="primary" onClick={handleCreate} style={{ margin: '16px 0' }}>
                        Done
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={navigateBack}>
                        Back
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default AddCourse;
