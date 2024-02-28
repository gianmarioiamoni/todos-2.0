import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, CssBaseline } from '@mui/material';

import { AppState } from '../providers/AppState.jsx';
import { AllTodoLists } from './AllTodoLists.jsx';
import { AppHeader } from './AppHeader.jsx';
import { CurrentTodoList } from './CurrentTodoList.jsx';

export default function Dashboard() {
    const navigate = useNavigate();
    const [isListDeleted, setIsListDeleted] = useState(false);
    const [isListUpdated, setIsListUpdated] = useState(false);

    function handleListDelete() {
        setIsListDeleted(true);
    }

    function handleListUpdated() {
        setIsListUpdated(true);
    }

    // logout function
    const handleLogout = async () => {
        try {
            // request to server to implement logout
            await axios.get('/logout');
            // after logout, redirect to login page
            navigate('/login');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <AppState>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppHeader handleListUpdated={handleListUpdated} handleLogout={handleLogout} />
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
