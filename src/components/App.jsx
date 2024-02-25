import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LoginPage from './user/LoginPage';
import RegisterPage from './user/RegisterPage';
import Homepage from './Homepage';

export default function App() {
  return (
      <div>
        <Routes>
        <Route exact path="/login" element={<LoginPage/>} />
        <Route exact path="/register" element={<RegisterPage/>} />
        <Route exact path="/" element={<Homepage/>} />
        </Routes>
      </div>
  );
}

