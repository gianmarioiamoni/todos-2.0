import { Typography, Button, Container, Link } from '@mui/material';
import AdbIcon from '@mui/icons-material/Adb';

import ResponsiveAppBar from "./ResponsiveAppBar"

export default function Homepage() {
    return (
        <div>
            <ResponsiveAppBar />
            <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <Typography variant="h3" sx={{ marginBottom: 4 }}>
                    Welcome to Todos 2.0
                </Typography>
                <Typography variant="h5" sx={{ marginBottom: 2, textAlign: 'center' }}>
                    Organize. Prioritize. Achieve.
                </Typography>
                <Typography variant="h5" sx={{ marginBottom: 2, textAlign: 'center' }}>
                    Efficiency Elevated: Your Personal Task Master
                </Typography>
                <Button variant="contained" color="primary" href="/login" sx={{ marginBottom: 2 }}>
                    Login
                </Button>
                <Typography variant="body1">
                    Don't have an account? <Link href="/register">Registration</Link>
                </Typography>
            </Container>
        </div>
    );
};

