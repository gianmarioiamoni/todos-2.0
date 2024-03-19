import { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Link, IconButton, Drawer, List, ListItem, ListItemText, ListItemIcon, Box } from '@mui/material';
import AdbIcon from '@mui/icons-material/Adb';
import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login';
import HowToRegIcon from '@mui/icons-material/HowToReg';


import LogoutSet from './user/utils/LogoutSet';
import { useAuth } from '../hooks/useAuth';

import { useNavigate } from 'react-router-dom';

export default function ResponsiveAppBar({ handleLogout, showHome=true, showLogin=true, showRegister=true }) {
    const { user } = useAuth();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const navigate = useNavigate();

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    return (
        <AppBar position="static">
            <Container maxWidth="md">
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" component="a" href="#" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                        <AdbIcon sx={{ mr: 1 }} /> Todos 2.0
                    </Typography>
                    <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                        {user ? (
                            <LogoutSet handleLogout={handleLogout} />
                        ) : (
                            <div>
                                {showHome && (
                                    <Button
                                        color="inherit"
                                        sx={{ ml: 1 }}
                                        onClick={() => navigate("/")}
                                    >
                                        Home
                                    </Button>
                                )}
                                {showLogin && (
                                        <Button
                                            component={Link}
                                            href="/login"
                                            color="inherit"
                                            sx={{ mr: 1 }}>
                                        Login
                                    </Button>
                                )}
                                {showRegister && (
                                        <Button
                                            component={Link}
                                            href="/register"
                                            color="inherit">
                                        Register
                                    </Button>
                                )}
                            </div>
                        )}
                    </Box>
                    <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                        <IconButton onClick={toggleDrawer} color="inherit">
                            <MenuIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </Container>
            {/* Drawer for small screen */}
            <Drawer anchor="right" open={isDrawerOpen} onClose={toggleDrawer}>
                {user ? (
                    <LogoutSet handleLogout={handleLogout} dir="column" />
                ) : (
                    <List>
                        <ListItem component={Link} href="/login" onClick={toggleDrawer}>
                            <ListItemIcon>
                                <LoginIcon />
                            </ListItemIcon>
                            <ListItemText primary="Login" />
                        </ListItem>
                        <ListItem component={Link} href="/register" onClick={toggleDrawer}>
                            <ListItemIcon>
                                <HowToRegIcon />
                            </ListItemIcon>
                            <ListItemText primary="Register" />
                        </ListItem>
                    </List>
                )}
            </Drawer>
        </AppBar>
    );
};




