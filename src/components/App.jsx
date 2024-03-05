// import { BrowserRouter as Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './user/LoginPage';
import RegisterPage from './user/RegisterPage';
import Homepage from './Homepage';
import Dashboard from './Dashboard';


const serverUrl = process.env.NODE_ENV === 'production' ? import.meta.env.VITE_SERVER_URL : import.meta.env.VITE_LOCAL_SERVER_URL;

export default function App() {
  // const [user, setUser] = useState(null);
  const [user, setUser] = useState();

  useEffect(() => {
    const getUser = async () => {
    
      // const response = await axios.get("http://localhost:5000/userinfo", { withCredentials: true })
      const response = await axios.get("http://localhost:5000/login/success", { withCredentials: true })
      const resObj = response.data;

      console.log("App() - useEffect([]) - resObj = ", resObj)

      if (resObj.success) {
        console.log("App() - useEffect)[]) - setUser(resObj.user)")
        setUser(resObj.user);
      } else {
        console.log("App() - useEffect)[]) - setUser(resObj.null)")
        setUser(null);
      }

    } // getUser()
    getUser();
    console.log("***** App() - useEffect([]) - user: ", user)

  }, []);


  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage setUser={setUser} />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage setUser={setUser} />} />
          <Route path="/" element={<Homepage user={user} setUser={setUser} />} />
          <Route path="/dashboard" element={user ? <Dashboard user={user} setUser={setUser} /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

