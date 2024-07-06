import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProjects } from '../api/api';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem('token');
      const data = await getProjects(token);
      setProjects(data);
    };
    fetchProjects();
  }, []);

  return (
    <div className="container">
      <h1>Dashboard</h1>
      <table>
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Project Category</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project._id}>
              <td>{project.name}</td>
              <td>{project.category}</td>
              <td>{new Date(project.dueDate).toLocaleDateString()}</td>
              <td>
                <Link to={`/project/${project._id}`}>View / Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
