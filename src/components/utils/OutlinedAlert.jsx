import Alert from '@mui/material/Alert';

export default function OutlinedAlert({ severity, message, setIsAlert }) {
    return (
        <div sx={{ width: '100%' }}>
            <Alert variant="outlined" severity={severity} onClose={() => setIsAlert(false)} >
                {message}
            </Alert>
        </div>
    );
}