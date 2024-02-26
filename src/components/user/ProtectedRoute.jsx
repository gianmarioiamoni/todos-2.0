import { useEffect } from 'react';

import { useNavigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
    const navigate = useNavigate();
    // const { isAuthenticated } = useAuth();

    const isAuthenticated = false;

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