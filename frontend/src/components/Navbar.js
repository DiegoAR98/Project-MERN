import React, { useState } from 'react';
import axios from 'axios';

const Footer = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      await axios.post(`${API_URL}/contact`, formData);
      setFormData({
        name: '',
        email: '',
        message: '',
      });
      setShowForm(false); // Hide form after submission
      alert('Your message has been sent!');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('There was an error sending your message. Please try again later.');
    }
  };

  return (
    <footer className="bg-dark text-white text-center py-4 mt-5">
      <p className="mb-2">© 2024 Project Manager. All Rights Reserved.</p>
      <button className="btn btn-outline-light" onClick={() => setShowForm(!showForm)}>
        Contact Us
      </button>

      {showForm && (
        <div className="contact-form mt-4">
          <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: '500px' }}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="message" className="form-label">Message</label>
              <textarea
                className="form-control"
                id="message"
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Send Message</button>
          </form>
        </div>
      )}
    </footer>
  );
};

export default Footer;
