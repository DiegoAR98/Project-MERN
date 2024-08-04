import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPasswordForm = () => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/users/reset-password/${token}`, { password });
      setMessage('Password reset successful! You can now log in with your new password.');
      navigate('/login');
    } catch (error) {
      setMessage('Password reset failed. Please try again.');
    }
  };

  return (
    <div className="container my-5">
      <h1 className="mb-4">Reset Password</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">New Password:</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Reset Password</button>
      </form>
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
};

export default ResetPasswordForm;
