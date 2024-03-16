import React, { useState } from 'react';
import BachelorDegree from './BachelorDegree'; // Update the path accordingly
import BachelorDegreeWithHonours from './BachelorDegreeWithHonours'; // Update the path accordingly
import MasterDegree from './MasterDegree'; // Update the path accordingly
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import Sidebar from './Sidebar';
import AdminLayout from './AdminLayout';
import { useNavigate } from 'react-router-dom';

const MPrograms = () => {
    const [selectedTab, setSelectedTab] = useState(0);
    const navigate = useNavigate();

    const handleTabChange = (event, newValue) => {
        const pages = ['BachelorDegree', 'BachelorDegreeWithHonours', 'MasterDegree'];
        const selectedPage = pages[newValue];
        setSelectedTab(newValue);
    };

    return (
        <AdminLayout>
            <Sidebar />
            <Box sx={{ flexGrow: 1, paddingLeft: '20px', paddingRight: '20px', paddingTop: '80px' }}>
                <Tabs value={selectedTab} onChange={handleTabChange}>
                    <Tab label="Bachelor Degree" />
                    <Tab label="Bachelor Degree with Honours" />
                    <Tab label="Master Degree" />
                </Tabs>
                <Typography>
                    {selectedTab === 0 && <BachelorDegree />}
                    {selectedTab === 1 && <BachelorDegreeWithHonours />}
                    {selectedTab === 2 && <MasterDegree />}
                </Typography>
            </Box>
        </AdminLayout>
    );
};

export default MPrograms;
