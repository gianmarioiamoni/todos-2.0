import { useEffect } from 'react';

import { useNavigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
    const navigate = useNavigate();

    const isAuthenticated = true; // ADD AUTHENTICATION HERE

    useEffect(() => {
        if(!isAuthenticated) {
            navigate("login");
    }}, [])

    
    return (
        <div>
            <Outlet />
        </div>
    );
};