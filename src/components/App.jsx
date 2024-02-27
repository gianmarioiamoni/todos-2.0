// import { BrowserRouter as Route, Routes } from 'react-router-dom';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './user/LoginPage';
import RegisterPage from './user/RegisterPage';
import Homepage from './Homepage';
import Dashboard from './Dashboard';
import ProtectedRoute from './user/ProtectedRoute';

export default function App() {
  const user = true;

  return (
    <BrowserRouter>
    <div>
      <Routes>
          <Route exact path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
          <Route exact path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />
        <Route exact path="/" element={<Homepage />} />
        {/* <Route element={<ProtectedRoute />}> */}
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        {/* </Route> */}
      </Routes>
      </div>
    </BrowserRouter>
  );
}

{/* <BrowserRouter>
  <div>
    <Navbar user={user} />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/login"
        element={user ? <Navigate to="/" /> : <Login />}
      />
      <Route
        path="/post/:id"
        element={user ? <Post /> : <Navigate to="/login" />}
      />
    </Routes>
  </div>
</BrowserRouter> */}

      