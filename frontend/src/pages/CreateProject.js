import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../api/api';

const CreateProject = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('college');
  const [dueDate, setDueDate] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const project = { name, description, category, dueDate };
    try {
      await createProject(project, token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating project', error);
    }
  };

  return (
    <div className="container my-5">
      <h1 className="mb-4">Create Project</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name:</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description:</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Category:</label>
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="college">College</option>
            <option value="internship">Internship</option>
            <option value="work">Work</option>
            <option value="others">Others</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Due Date:</label>
          <input
            type="date"
            className="form-control"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Create</button>
      </form>
    </div>
  );
};

export default CreateProject;
