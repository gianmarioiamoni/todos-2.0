import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { Box, Button, TextField, Typography } from '@mui/material';

import OutlinedAlert from '../utils/OutlinedAlert';

import loginImage from '../../assets/images/background-1.jpg'; 
import { loginUser } from '../../services/userServices';
import { useAuth } from '../../hooks/useAuth';


const serverUrl = process.env.NODE_ENV === 'production' ? import.meta.env.VITE_SERVER_URL : import.meta.env.VITE_LOCAL_SERVER_URL;

// This component serves as the user’s login interface.
// It uses the useAuth Hook to handle user authentication.
// When users enter their credentials and submit the form, 
// the login() function from useAuth is called to authenticate 
// and log them in.

export default function LoginPage() {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });

    const { login } = useAuth();

    const [isAlert, setIsAlert] = useState(false);
    const [alertData, setAlertData] = useState({ severity: "error", message: "Please login" });

    
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

    // MOCKUP
    const handleLogin = async (e) => {
        e.preventDefault();
        // Here you would usually send a request to your backend to authenticate the user
        // For the sake of this example, we're using a mock authentication
        if (username === "user" && password === "password") {
            // Replace with actual authentication logic
            await login({ username });
        } else {
            alert("Invalid username or password");
        }
    };

    const handleSubmit = async (e) => {
        console.log("===== LoginPage() - handleSubmit()")
        e.preventDefault();
        try {
            // const response = await axios.post(serverUrl + '/login', credentials, { withCredentials: true });
            // console.log("===== LoginPage() - handleSubmit() - response.data: ", response.data)
            // const resObj = response.data;

            const resObj = await loginUser(credentials);
            console.log("===== LoginPage() - handleSubmit() - resObj: ", resObj)

            if (!resObj.success) {
                console.log("===== LoginPage() - handleSubmit() - !resObj.success ")
                showAlert("error", resObj.message);
            } else {
                showAlert("success", resObj.message);
                // await login({ username });
                await login(credentials);
                console.log("===== LoginPage() - handleSubmit() - resObj.success ")
            }
            console.log("===== LoginPage() - handleSubmit() - res.user = ", resObj.user)
            // setUser(resObj.user)
            // navigate(resObj.navigate)

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
            <img src={loginImage} alt="Login Image" style={{ maxWidth: '100%', height: 'auto' }} />
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
