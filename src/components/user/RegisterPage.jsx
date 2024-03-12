import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { Box, Button, TextField, Typography } from '@mui/material';

import { registerUser } from "../../services/userServices"

import SocialsRegistrationBox from './utils/SocialsRegistrationBox';

import OutlinedAlert from '../utils/OutlinedAlert';

import registerImage from '../../assets/images/background-3.jpg';

import { useAuth } from '../../hooks/useAuth';

const serverUrl = process.env.NODE_ENV === 'production' ? import.meta.env.VITE_SERVER_URL : import.meta.env.VITE_LOCAL_SERVER_URL;

export default function RegisterPage({ setUser }) {

    const [isAlert, setIsAlert] = useState(false);
    const [alertData, setAlertData] = useState({ severity: "error", message: "Please login" });

    const { login } = useAuth();

    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: ''
    });

    function showAlert(severity, message) {
        setAlertData({ severity: severity, message: message });
        setIsAlert(true);
    }


    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const resObj = await registerUser(userData);
            if (!resObj.success) {
                showAlert("error", resObj.message);
            } else {
                setUserData(resObj.user);
                
                // useAuth custom hook
                await login(resObj.user);
            }

        } catch (error) {
            console.error('Error during registration:', error);
        }
    };

    const handleGoogleRegister = async () => {
        try {
            console.log("RegisterPage() - handleGoogleRegister() - serverUrl = ", serverUrl)
            // Redirect the user to Google authentication URL
            window.location.href = `${serverUrl}/auth/google`;
        } catch (error) {
            console.error('Error during Google registration:', error);
        }
    };

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
            {isAlert && <OutlinedAlert severity={alertData.severity} message={alertData.message} setIsAlert={setIsAlert} />}
            <Typography variant="h5" gutterBottom>
                Register
            </Typography>
            <img src={registerImage} alt="Register Image" style={{ maxWidth: '100%', height: 'auto' }} />
            <form onSubmit={handleSubmit}>
                <TextField
                    name="username"
                    label="Username"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={userData.username}
                    onChange={handleChange}
                />
                <TextField
                    name="email"
                    type="email"
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={userData.email}
                    onChange={handleChange}
                />
                <TextField
                    name="password"
                    type="password"
                    label="Password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={userData.password}
                    onChange={handleChange}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                    Register
                </Button>
            </form>
            <Typography variant="body1">
                Do you already have an account? <Link to="/login">Login</Link>
            </Typography>
        
            <SocialsRegistrationBox onClickGoogle={handleGoogleRegister} />

        </Box>
    );
};


