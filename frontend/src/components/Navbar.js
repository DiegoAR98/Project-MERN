import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="navbar">
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/create-project">Create Project</Link>
      <button onClick={handleLogout} style={{ marginLeft: 'auto', background: 'none', color: 'white', border: 'none', cursor: 'pointer' }}>
        Logout
      </button>
    </div>
  );
};

export default Navbar;
