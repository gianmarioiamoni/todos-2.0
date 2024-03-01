import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { Box, Button, TextField, Typography } from '@mui/material';

import axios from 'axios';

import { registerUser } from "../../services/userServices"

import OutlinedAlert from '../utils/OutlinedAlert';

const serverUrl = process.env.NODE_ENV === 'production' ? import.meta.env.VITE_SERVER_URL : import.meta.env.VITE_LOCAL_SERVER_URL;

export default function RegisterPage({setUser}) {
    const navigate = useNavigate();

    const [isAlert, setIsAlert] = useState(false);
    const [alertData, setAlertData] = useState({ severity: "error", message: "Please login" });

    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // const response = await axios.post(serverUrl + '/register', userData);
            // const response = registerUser(userData)

            const response = await axios.post(serverUrl + '/register', userData, { withCredentials: true });
            console.log("===== handleSubmit() - response.data: ", response.data)
            const resObj = response.data;

            if (!resObj.success) {
                showAlert("error", resObj.message);
                setUser(null);
            } else {
                setUser(resObj.user)
            }
            navigate("/register")

            console.log("**** handleSubmit() - response.data: ", response.data); // manage answer
            setUserData(response.data);
            setUser(response.data);

            // navigate('/login'); // redirect to login after registration
        } catch (error) {
            console.error('Error during registration:', error);
        }
    };

    return (
            <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Register
                </Typography>
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
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Register
                    </Button>
            </form>
            <Typography variant="body1">
                Do you already have an account? <Link to="/login">Login</Link>
            </Typography>
            </Box>
    );
};

