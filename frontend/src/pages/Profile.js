import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState({ name: '', email: '' });
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Use the environment variable for the API URL
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("Token is missing from localStorage.");
        return;
      }
  
      try {
        console.log('Fetching profile with token:', token); // Debugging line
        const { data } = await axios.get(`${API_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Profile data received:', data); // Debugging line
        setUser(data);
      } catch (error) {
        console.error("Error fetching profile:", error.response?.data || error.message);
      }
    };
  
    fetchProfile();
  }, [API_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `${API_URL}/api/users/profile`,
        { ...user, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/dashboard');
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
    }
  };
  

  return (
    <div className="container my-5">
      <h1>Profile</h1>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label className="form-label">Name:</label>
          <input
            type="text"
            className="form-control"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email:</label>
          <input
            type="email"
            className="form-control"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password:</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Update</button>
      </form>
    </div>
  );
};

export default Profile;
