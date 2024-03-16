import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const AdminLayout = ({ children }) => {
    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" sx={{ width: `calc(100% - 240px)`, marginLeft: '240px' }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        Administrator Mode
                    </Typography>
                </Toolbar>
            </AppBar>
            {children}
        </Box>
    );
};

export default AdminLayout;
