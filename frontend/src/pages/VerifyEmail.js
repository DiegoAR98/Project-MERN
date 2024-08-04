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
    <div className="container my-5">
      <div className="card">
        <div className="card-body text-center">
          <h1 className="card-title">Email Verification</h1>
          <p className={`card-text ${message.includes('successfully') ? 'text-success' : 'text-danger'}`}>
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
