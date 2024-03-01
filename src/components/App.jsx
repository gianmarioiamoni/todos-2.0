// import { BrowserRouter as Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from './user/LoginPage';
import RegisterPage from './user/RegisterPage';
import Homepage from './Homepage';
import Dashboard from './Dashboard';
import cookieParser from 'cookie-parser';
import { CookiesProvider, useCookies } from 'react-cookie'

const serverUrl = process.env.NODE_ENV === 'production' ? import.meta.env.VITE_SERVER_URL : import.meta.env.VITE_LOCAL_SERVER_URL;

export default function App() {
  const [user, setUser] = useState(null);

  // const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      // const response = await axios.get("http://localhost:5000/login/success", { withCredentials: true });
      const response = await axios.get("http://localhost:5000/userinfo", { withCredentials: true });
      const resObj = response.data;

      console.log("App() - useEffect([]) - resObj = ", resObj)

      if (resObj.success) {
        setUser(resObj.user);
      } else {
        setUser(null);
      }

    //   console.log("App() - useEffect([]) -  _locals= ", _locals)
    //   if (_locals) {
    //     setUser({username: _locals.currentUser})
    //   } else {
    //     setUser(null)
    //   }
        
    } // getUser()
    getUser();

    // console.log("App() - useEffect([]) - user = ", user)

    // LEGGERE COOKIE "SESSION" ???

  }, []);

  // useEffect(() => {
  //   navigate("/login");
  // },[user])

  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route exact path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage setUser={setUser} />} />
          <Route exact path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage setUser={setUser} />} />
          <Route exact path="/" element={<Homepage user={user} />} />
          <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

