// import { BrowserRouter as Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './user/LoginPage';
import RegisterPage from './user/RegisterPage';
import Homepage from './Homepage';
import Dashboard from './Dashboard';

import { useLogoutState } from '../providers/LogoutState';

const serverUrl = process.env.NODE_ENV === 'production' ? import.meta.env.VITE_SERVER_URL : import.meta.env.VITE_LOCAL_SERVER_URL;

export default function App() {
  const [user, setUser] = useState(null);

  const { isLogout, setIsLogout } = useLogoutState();

  useEffect(() => {
    const getUser = async () => {
      const response = await axios.get("http://localhost:5000/userinfo", { withCredentials: true });
      const resObj = response.data;

      console.log("App() - useEffect([]) - resObj = ", resObj)
      console.log("App() - useEffect([]) - isLogout = ", isLogout)

      if (resObj.success && !isLogout) {
        console.log("App() - useEffect)[]) - setUser(resObj.user)")
        setUser(resObj.user);
      } else {
        console.log("App() - useEffect)[]) - setUser(resObj.null)")
        setUser(null);
        setIsLogout(true);
      }

    } // getUser()
    getUser();

  }, []);


  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route exact path="/login" element={user && !isLogout ? <Navigate to="/dashboard" /> : <LoginPage setUser={setUser} />} />
          <Route exact path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage setUser={setUser} />} />
          <Route exact path="/" element={<Homepage user={user} />} />
          <Route path="/dashboard" element={user && !isLogout ? <Dashboard user={user} setUser={setUser} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

