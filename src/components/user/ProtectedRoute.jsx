import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

// ProtectedRoute component checks the current user’s state from the useAuth Hook 
// and redirects them to the homescreen if they are not authenticate

export const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) {
        // user is not authenticated
        return <Navigate to="/login" />;
    }
    return children;
};