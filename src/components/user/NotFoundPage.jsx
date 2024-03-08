// export default function NotFoundPage () {
//     return (
//         // <PageLayout>
//             <div className="content-layout">
//                 <h1 id="page-title" className="content__title">
//                     Page Not Found
//                 </h1>
//             </div>
//         // </PageLayout>
//     );
// };

// import React from 'react';
// import { makeStyles } from '@mui/material-ui/styles'; 
// import { Typography, Container, Button } from '@material-ui/core';
// import { Link } from 'react-router-dom';

// const useStyles = makeStyles((theme) => ({
//     root: {
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         height: '100vh',
//         textAlign: 'center',
//     },
//     heading: {
//         marginBottom: theme.spacing(2),
//     },
//     button: {
//         marginTop: theme.spacing(2),
//     },
// }));



import React from 'react';
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


