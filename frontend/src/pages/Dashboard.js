import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (userInfo) {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        try {
          const { data } = await axios.get('http://localhost:5000/api/projects', config);
          setProjects(data);
        } catch (error) {
          console.error('Error fetching projects', error);
        }
      }
    };

    fetchProjects();
  }, []);

  const handleCreateProject = () => {
    navigate('/create-project');
  };

  return (
    <div className="container">
      <h1>Dashboard</h1>
      <button onClick={handleCreateProject}>Create Project</button>
      <ul>
        {projects.map((project) => (
          <li key={project._id}>
            <Link to={`/project/${project._id}`}>
              {project.name} - {project.category} - {new Date(project.dueDate).toLocaleDateString()}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
