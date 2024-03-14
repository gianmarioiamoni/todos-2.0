import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, CssBaseline } from '@mui/material';

import { AppState } from '../providers/AppState.jsx';
import { AllTodoLists } from './AllTodoLists.jsx';
import { AppHeader } from './AppHeader.jsx';
import { CurrentTodoList } from './CurrentTodoList.jsx';

import { logoutUser } from '../services/userServices.js';

import { useAuth } from '../hooks/useAuth.jsx';


export default function Dashboard() {
    const [isListDeleted, setIsListDeleted] = useState(false);
    const [isListUpdated, setIsListUpdated] = useState(false);

    const { user, logout } = useAuth();

    useEffect(() => {
        console.log("Dashboard() - useEffect([]) - user = ", user)
    } , [])

    function handleListDelete() {
        setIsListDeleted(true);
    }

    function handleListUpdated() {
        setIsListUpdated(true);
    }

    // logout function
    const handleLogout = async () => {
        try {
            const response = await logoutUser(user);
            // useAuth custom hook
            logout();
            // navigate(response.navigate);
        }
        catch (err) { console.log(err) }
    }
    

    return (
        <AppState>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppHeader
                    handleListUpdated={handleListUpdated}
                    // user={user}
                    handleLogout={handleLogout} />
                <AllTodoLists
                    isListUpdated={isListUpdated}
                    setIsListUpdated={setIsListUpdated}
                    handleListDelete={handleListDelete}
                     
                />
                <CurrentTodoList
                    isListDeleted={isListDeleted}
                    setIsListDeleted={setIsListDeleted}
                    handleListUpdated={handleListUpdated}
                />
            </Box>
        </AppState>
    );
};
