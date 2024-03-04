import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { Box, Button, TextField, Typography } from '@mui/material';

import axios from 'axios';

import OutlinedAlert from '../utils/OutlinedAlert';


const serverUrl = process.env.NODE_ENV === 'production' ? import.meta.env.VITE_SERVER_URL : import.meta.env.VITE_LOCAL_SERVER_URL;

export default function LoginPage({ setUser }) {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });

    const [isAlert, setIsAlert] = useState(false);
    const [alertData, setAlertData] = useState({ severity: "error", message: "Please login" });

    useEffect(() => {
        // async function getLogin() {
        //     await axios.get(serverUrl + '/login');
        // }
        // getLogin();
        // console.log("===== LoginPage() - useEffect([]) - user: ", user)
    } , []);

    
    function showAlert(severity, message) {
        setAlertData({ severity: severity, message: message });
        setIsAlert(true);
    }

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(serverUrl + '/login', credentials, { withCredentials: true });
            console.log("===== LoginPage() - handleSubmit() - response.data: ", response.data)
            const resObj = response.data;

            if (!resObj.success) {
                console.log("===== LoginPage() - handleSubmit() - !resObj.success ")
                showAlert("error", resObj.message);
            } else {
                showAlert("success", resObj.message);
                console.log("===== LoginPage() - handleSubmit() - resObj.success ")
            }
            console.log("===== LoginPage() - handleSubmit() - res.user = ", resObj.user)
            setUser(resObj.user)
            navigate(resObj.navigate)

        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
            {isAlert && <OutlinedAlert severity={alertData.severity} message={alertData.message} setIsAlert={setIsAlert} />}
            <Typography variant="h5" gutterBottom>
                Login
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    name="username"
                    label="Username"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={credentials.username}
                    onChange={handleChange}
                />
                <TextField
                    name="password"
                    type="password"
                    label="Password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={credentials.password}
                    onChange={handleChange}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Login
                </Button>
            </form>
            <Typography variant="body1">
                Don't have an account? <Link to="/register">Registration</Link>
            </Typography>
        </Box>
    );
};
