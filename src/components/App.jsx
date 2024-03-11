// import { BrowserRouter as Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './user/LoginPage';
import RegisterPage from './user/RegisterPage';
import Homepage from './Homepage';
import Dashboard from './Dashboard';

import { getUserInfo } from '../services/userServices';

import { ProtectedRoute } from './user/ProtectedRoute';
import { AuthProvider } from '../hooks/useAuth';
// import { useAuth } from '../hooks/useAuth.jsx';


const serverUrl = process.env.NODE_ENV === 'production' ? import.meta.env.VITE_SERVER_URL : import.meta.env.VITE_LOCAL_SERVER_URL;


// App.jsx encapsulates all routes within the AuthProvider from useAuth Hook 
// to provide a consistent authentication context across your app.
// For routes that require authentication, we use the < ProtectedRoute /> component 
// to restrict access to only authenticated users
export default function App() {
  // const [user, setUser] = useState(null);
  // const { user } = useAuth();

  useEffect(() => {
    // const getUser = async () => {
    
    //   // const response = await axios.get("http://localhost:5000/userinfo", { withCredentials: true })
    //   const resObj = await getUserInfo();

    //   console.log("App() - useEffect([]) - resObj = ", resObj)

    //   if (resObj.success) {
    //     console.log("App() - useEffect)[]) - setUser(resObj.user)")
    //     setUser(resObj.user);
    //   } else {
    //     console.log("App() - useEffect)[]) - setUser(resObj.null)")
    //     setUser(null);
    //   }

    // } 
    // getUser();
    // console.log("***** App() - useEffect([]) - user: ", user)

  }, []);

  
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Homepage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>}
        />
      </Routes>
    </AuthProvider>
  );
}

