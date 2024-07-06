import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectById, updateProject } from '../api/api';

const Project = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState({
    name: '',
    description: '',
    category: 'college',
    dueDate: '',
  });

  useEffect(() => {
    const fetchProject = async () => {
      const token = localStorage.getItem('token');
      const data = await getProjectById(id, token);
      setProject(data);
    };
    fetchProject();
  }, [id]);

  const handleChange = (e) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await updateProject(id, project, token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating project', error);
    }
  };

  return (
    <div className="container">
      <h1>Edit Project</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={project.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={project.description}
            onChange={handleChange}
          ></textarea>
        </div>
        <div>
          <label>Category:</label>
          <select
            name="category"
            value={project.category}
            onChange={handleChange}
          >
            <option value="college">College</option>
            <option value="internship">Internship</option>
            <option value="work">Work</option>
            <option value="others">Others</option>
          </select>
        </div>
        <div>
          <label>Due Date:</label>
          <input
            type="date"
            name="dueDate"
            value={project.dueDate}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default Project;
