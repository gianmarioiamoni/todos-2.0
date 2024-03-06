import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, CssBaseline } from '@mui/material';

import { AppState } from '../providers/AppState.jsx';
import { AllTodoLists } from './AllTodoLists.jsx';
import { AppHeader } from './AppHeader.jsx';
import { CurrentTodoList } from './CurrentTodoList.jsx';

import { logout } from '../services/userServices.js';


export default function Dashboard({ user, setUser }) {
    const navigate = useNavigate();
    const [isListDeleted, setIsListDeleted] = useState(false);
    const [isListUpdated, setIsListUpdated] = useState(false);

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
            const response = await logout(user, setUser);
            navigate(response.navigate);
        }
        catch (err) { console.log(err) }
    }
    

    return (
        <AppState>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppHeader
                    handleListUpdated={handleListUpdated}
                    user={user}
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
