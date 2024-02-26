import { Typography, Button, Container, Link } from '@mui/material';
import AdbIcon from '@mui/icons-material/Adb';

import ResponsiveAppBar from "./ResponsiveAppBar";
import { themeSelection, themeHighlight } from '../common/themes';

export default function Homepage() {
    return (
        <div style={{ backgroundImage: "url('/src/assets/images/background-4.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh' }}>
            <ResponsiveAppBar />
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
                <Button variant="contained" color="primary" href="/login" sx={{ marginBottom: 2 }}>
                    Login
                </Button>
                <Typography variant="body1" sx={{ color: themeSelection.palette.secondary.main}}>
                    Don't have an account? <Link href="/register" sx={{ color: themeSelection.palette.primary.main }} >Registration</Link>
                </Typography>
            </Container>
        </div>
    );
};

