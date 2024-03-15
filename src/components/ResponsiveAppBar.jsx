import { AppBar, Toolbar, Typography, Button, Container, Link } from '@mui/material';
import AdbIcon from '@mui/icons-material/Adb';
// import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';

import LogoutSet from './user/utils/LogoutSet';

import { useAuth } from '../hooks/useAuth';

export default function ResponsiveAppBar({ handleLogout }) {

    const { user } = useAuth();

    
    return (
        <AppBar position="static">
            <Container maxWidth="md">
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" component="a" href="#" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                        <AdbIcon sx={{ mr: 1 }} /> Todos 2.0
                    </Typography>
                    {user ? (
                        <LogoutSet handleLogout={handleLogout} />
                    ) : (
                        <div>
                            <Button component={Link} href="/login" color="inherit" sx={{ mr: 1 }}>
                                Login
                            </Button>
                            <Button component={Link} href="/register" color="inherit">
                                Register
                            </Button>
                        </div>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
};

