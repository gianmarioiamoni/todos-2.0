import { Typography, Button, Container, Link } from '@mui/material';

import { useNavigate } from 'react-router-dom';

import ResponsiveAppBar from "./ResponsiveAppBar";
import { themeSelection } from '../common/themes';

import { logoutUser } from '../services/userServices';

import { useAuth } from '../hooks/useAuth';

export default function Homepage() {

    const { user, logout } = useAuth();

    // logout function
    const handleLogout = async () => {
        try {
            const response = await logoutUser(user);
            // useAuth custom hook
            logout();
            // navigate(response.navigate);
            // navigate("/");
        }
        catch (err) { console.log(err) }
    }
    return (
        <div style={{ backgroundImage: "url('/src/assets/images/background-4.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh' }}>
            <ResponsiveAppBar handleLogout={handleLogout} />
            <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <Typography variant="h3" sx={{ marginBottom: 4, color: themeSelection.palette.secondary.main, }}>
                    Welcome to Todos 2.0
                </Typography>
                <Typography variant="h5" sx={{ marginBottom: 2, textAlign: 'center', color: themeSelection.palette.secondary.main }}>
                    Organize. Prioritize. Achieve.
                </Typography>
                {/* <Typography variant="h5" sx={{ marginBottom: 2, textAlign: 'center' }}>
                    Efficiency Elevated: Your Personal Task Master
                </Typography> */}
                {user ? (
                    <Button variant="contained" color="primary" href="/dashboard" sx={{ marginBottom: 2 }}>
                        View your Todos
                    </Button>
                ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Button variant="contained" color="primary" href="/login" sx={{ marginBottom: 2 }}>
                            Login
                        </Button>
                        <Typography variant="body1" sx={{ color: themeSelection.palette.secondary.main }}>
                            Don't have an account? <Link href="/register" sx={{ color: themeSelection.palette.primary.main }} >Registration</Link>
                        </Typography>
                    </div>
                )}
            </Container>
        </div>
    );
};

