import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const userInfo = localStorage.getItem('userInfo');

  const handleLogout = () => {
    // Clear user info from local storage
    localStorage.removeItem('userInfo');
    // Redirect to login page
    navigate('/login');
  };

  return (
    <nav>
      <ul>
        {!userInfo && (
          <>
            <li>
              <Link to="/">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
        {userInfo && (
          <>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
