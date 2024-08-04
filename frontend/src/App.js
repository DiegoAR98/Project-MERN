import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Project from './pages/Project';
import CreateProject from './pages/CreateProject';
import ResetPassword from './pages/ResetPassword';
import ResetPasswordForm from './pages/ResetPasswordForm';
import VerifyEmail from './pages/VerifyEmail';
import Task from './pages/Task';
import MainPage from './pages/MainPage';  // Import MainPage
import Footer from './components/Footer';  // Import Footer

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<MainPage />} />  {/* Set MainPage as the root */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/project/:id" element={<Project />} />
            <Route path="/create-project" element={<CreateProject />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/reset-password/:token" element={<ResetPasswordForm />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            <Route path="/project/:projectId/task/:taskId" element={<Task />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
