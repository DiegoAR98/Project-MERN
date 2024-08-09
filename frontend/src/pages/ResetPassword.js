import React, { useState } from 'react';
import axios from 'axios';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // Use the environment variable for the API URL
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/users/reset-password`, { email });
      setMessage('Password reset email sent. Please check your email.');
    } catch (error) {
      setMessage('Password reset failed. Please try again.');
    }
  };

  return (
    <div className="container my-5">
      <h1 className="mb-4">Reset Password</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Send Reset Email</button>
      </form>
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
};

export default ResetPassword;
