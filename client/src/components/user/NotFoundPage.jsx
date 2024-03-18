import { Typography, Container, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
};

const headingStyle = {
    marginBottom: '16px',
};

const buttonStyle = {
    marginTop: '16px',
};

export default function NotFoundPage() {
    return (
        <Container style={containerStyle}>
            <Typography variant="h3" style={headingStyle}>
                Page Not Found
            </Typography>
            <Typography variant="body1">
                The page you are looking for might have been removed or is temporarily unavailable.
            </Typography>
            <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/"
                style={buttonStyle}
            >
                Go to Home
            </Button>
        </Container>
    );
};


