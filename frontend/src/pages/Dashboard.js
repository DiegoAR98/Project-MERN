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
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Dashboard</h1>
        <button className="btn btn-primary" onClick={handleCreateProject}>
          Create Project
        </button>
      </div>
      <div className="row">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div key={project._id} className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{project.name}</h5>
                  <p className="card-text">
                    Category: {project.category} <br />
                    Due Date: {new Date(project.dueDate).toLocaleDateString()}
                  </p>
                  <Link to={`/project/${project._id}`} className="btn btn-outline-primary">
                    View Project
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <p className="text-center">No projects found. Create a new project to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
