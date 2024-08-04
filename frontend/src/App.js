import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import CreateProject from './pages/CreateProject';
import Project from './pages/Project';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import ResetPasswordForm from './pages/ResetPasswordForm';
import VerifyEmail from './pages/VerifyEmail';
import Task from './pages/Task';
import Navbar from './components/Navbar';
import './App.css';

const PrivateRoute = ({ element: Component, ...rest }) => {
  const userInfo = localStorage.getItem('userInfo');
  return userInfo ? <Component {...rest} /> : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute element={Dashboard} />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/create-project" element={<PrivateRoute element={CreateProject} />} />
        <Route path="/project/:id" element={<PrivateRoute element={Project} />} />
        <Route path="/project/:projectId/task/:taskId" element={<PrivateRoute element={Task} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPasswordForm />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
      </Routes>
    </Router>
  );
}

export default App;
