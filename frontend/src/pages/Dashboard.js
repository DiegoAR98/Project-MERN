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
      <ul>
        {projects.map((project) => (
          <li key={project._id}>
            <Link to={`/project/${project._id}`}>{project.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
