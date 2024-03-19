import { Route, Routes } from 'react-router-dom';
import LoginPage from './user/LoginPage';
import RegisterPage from './user/RegisterPage';
import Homepage from './Homepage';
import Dashboard from './Dashboard';
import NotFoundPage from './user/NotFoundPage'

import { ProtectedRoute } from './user/utils/ProtectedRoute'
import { AuthProvider } from '../hooks/useAuth';


const serverUrl = process.env.NODE_ENV === 'production' ? import.meta.env.VITE_SERVER_URL : import.meta.env.VITE_LOCAL_SERVER_URL;


// App.jsx encapsulates all routes within the AuthProvider from useAuth Hook 
// to provide a consistent authentication context across your app.
// For routes that require authentication, we use the <ProtectedRoute/> component 
// to restrict access to only authenticated users
export default function App() {
  
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
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </AuthProvider>
  );
}

