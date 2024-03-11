import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
const AuthContext = createContext();

// useAuth Hook exposes the user’s state and methods for user login and logout.
// When users successfully log in, the login() method modifies their state to reflect 
// their authentication status.
// In addition, when users log out, we redirect them to the homepage using React Router’s 
// useNavigate Hook.

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useLocalStorage("user", null);
    const navigate = useNavigate();

    // call this function when you want to authenticate the user
    // redirect to /dashboard after successful login
    const login = async (data) => {
        setUser(data);
        navigate("/dashboard");
    };

    // call this function to sign out logged in user
    // redirect to /home after successful login
    const logout = () => {
        setUser(null);
        navigate("/", { replace: true });
    };

    const getUser = () => {
        return user;
    }

    const value = useMemo(
        () => ({
            user,
            login,
            logout,
            getUser
        }),
        [user]
    );
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};