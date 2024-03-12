import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { Box, Button, TextField, Typography } from '@mui/material';

import OutlinedAlert from '../utils/OutlinedAlert';
import SocialsRegistrationBox from './utils/SocialsRegistrationBox';

import loginImage from '../../assets/images/background-1.jpg'; 
import { loginUser } from '../../services/userServices';
import { useAuth } from '../../hooks/useAuth';
import { ConstructionOutlined } from '@mui/icons-material';

import { jwtDecode } from "jwt-decode";


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

    const handleCallbackResponse = async (response) => {
        console.log("Encoded JWT ID token = ", response.credential);

        try {

            const userObj = jwtDecode(response.credential);
            console.log("userObj = ", userObj);

            await login(
                {
                    username: userObj.name,
                    email: userObj.email,
                    googleId: userObj.sub
                });
            
        } catch (err) {console.log(err)}

    }

    useEffect(() => {
        /* global google */
        google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleCallbackResponse
        });

        google.accounts.id.renderButton(
            document.getElementById("googleSignInDiv"),
            {
                theme: "outline",
                size: "large",
                locale: "en_EN",
                width: "250px",
                shape: "circle"
            }
        );

        google.accounts.id.prompt();
    }, [])

    
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
        console.log("===== LoginPage() - handleSubmit()")
        e.preventDefault();
        try {
            const resObj = await loginUser(credentials);
            console.log("===== LoginPage() - handleSubmit() - resObj: ", resObj)

            if (!resObj.success) {
                console.log("===== LoginPage() - handleSubmit() - !resObj.success ")
                showAlert("error", resObj.message);
            } else {
                showAlert("success", resObj.message);

                // useAuth custom hook
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

    const handleGoogleLogin = async () => {
        try {
            console.log("LoginPage() - handleGoogleLogin() - serverUrl = ", serverUrl)
            // Redirect the user to Google authentication URL
            window.location.href = `${serverUrl}/auth/google`;
        } catch (error) {
            console.error('Error during Google login:', error);
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

            {/* <SocialsRegistrationBox onClickGoogle={handleGoogleLogin} /> */}
            
            <div
                id="googleSignInDiv"
                style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

            </div>
        </Box>
    );
};
