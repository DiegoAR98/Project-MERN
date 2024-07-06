import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  const { token } = useParams();
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await axios.get(`/api/users/verify-email/${token}`);
        setMessage('Email verified successfully.');
      } catch (error) {
        setMessage('Email verification failed.');
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="container">
      <h1>Email Verification</h1>
      <p>{message}</p>
    </div>
  );
};

export default VerifyEmail;
