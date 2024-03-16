import React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import LogoutIcon from '@mui/icons-material/Logout';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import logoImage from '../../Assets/Images/PathFinder.svg'


const Sidebar = () => {
    const navigate = useNavigate();
    const handlePageClick = (page) => {
        if (page === 'Homepage') {
            navigate('/admin-panel');
        } else if (page === 'Courses') {
            navigate('/mcourses');
        } else if (page === 'Programs') {
            navigate('/mprograms');
        } else if (page === 'Admins') {
            navigate('/adminRegister');
        } 
        
        else if (page === 'Logout') {
            handleLogout();
            navigate('/');
            window.location.reload();
        }
    };

    const handleLogout = async () => {
        try {
          await auth.signOut();
          navigate('/');
        } catch (error) {
          console.error('Error logging out:', error);
        }
      };
    


    const icons = [<HomeIcon onClick={() => handlePageClick('Homepage')} />, <HistoryEduIcon onClick={() => handlePageClick('Courses')} />, <SchoolIcon onClick={() => handlePageClick('Programs')} />, <PersonIcon />, <SupervisedUserCircleIcon />];
    return (
        <Drawer
            sx={{
                width: 240,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: 240,
                    boxSizing: 'border-box',
                    backgroundColor: '#F5F5F5',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    marginLeft: 0,
                },
            }}
            variant="permanent"
            anchor="left"
        >
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'grey.200', textAlign: 'center', flexGrow: 0, margin: 0 }}>
               
                <img src={logoImage} height={25} style={{ filter: "drop-shadow(3px 3px 2px rgb(0 0 0 / 0.4))" }} />
            </Box>
            <Divider />
            <List sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', margin: 0 }}>
                <ListItem key="Homepage" disablePadding>
                    <ListItemButton onClick={() => handlePageClick('Homepage')}>
                        <ListItemIcon>
                            {icons[0]}
                        </ListItemIcon>
                        <ListItemText>
                            <Typography variant="body1" style={{ fontWeight: 'bold' ,color:"var(--Tertiary)" }}>
                                Homepage
                            </Typography>
                        </ListItemText>
                    </ListItemButton>
                </ListItem>
                {['Courses', 'Programs', 'Admins', 'Users'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton onClick={() => handlePageClick(text)}>
                            <ListItemIcon>
                                {icons[index + 1]}
                            </ListItemIcon>
                            <ListItemText>
                                <Typography variant="body1" style={{ fontWeight: 'bold',color:"var(--Tertiary)" }}>
                                    {text}
                                </Typography>
                            </ListItemText>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <Box sx={{ p: 2, borderTop: 1, borderColor: 'grey.200', marginTop: 'auto', margin: 0 }}>
                <List>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => handlePageClick('Logout')}>
                            <ListItemIcon>
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText>
                                <Typography variant="body1" style={{ fontWeight: 'bold', color:"var(--Alert)" }}>
                                    Logout
                                </Typography>
                            </ListItemText>
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Drawer>
    );
};

export default Sidebar;
