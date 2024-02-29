// import { BrowserRouter as Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from './user/LoginPage';
import RegisterPage from './user/RegisterPage';
import Homepage from './Homepage';
import Dashboard from './Dashboard';

const serverUrl = process.env.NODE_ENV === 'production' ? import.meta.env.VITE_SERVER_URL : import.meta.env.VITE_LOCAL_SERVER_URL;

export default function App() {
  const [user, setUser] = useState(null);

  // const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      //   fetch("http://localhost:5000/login/success", {
      //     method: "GET",
      //     // credentials: "include",
      //     headers: {
      //       Accept: "application/json",
      //       "Content-Type": "application/json",
      //       // "Access-Control-Allow-Credentials": true,
      //     },
      //   })
      //     .then((response) => {
      //       if (response.status === 200) return response.json();
      //       throw new Error("authentication has been failed!");
      //     })
      //     .then((resObject) => {
      //       // setUser(resObject.user);
      //       user = resObject.user;
      //     })
      //     .catch((err) => {
      //       console.log(err);
      //     });
      // };
      const response = await axios.get("http://localhost:5000/login/success", { withCredentials: true });
      const resObj = response.data;

      console.log("App() - useEffect([]) - resObj = ", resObj)

      if (resObj.success) {
        setUser(resObj.user);
      } else {
        setUser(null);
      }
    } // getUser()
    getUser();
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

