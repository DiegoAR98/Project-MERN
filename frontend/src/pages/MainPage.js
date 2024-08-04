import React from 'react';
import { Link } from 'react-router-dom';

const MainPage = () => {
  return (
    <div className="container text-center my-5">
      <h1>Welcome to Project Manager</h1>
      <p className="lead mt-4">
        Project Manager is your all-in-one tool to keep track of all your projects. Whether you’re managing
        school assignments, work tasks, or personal projects, our platform allows you to organize and monitor
        your progress efficiently.
      </p>
      <p>
        Create projects, add tasks, and track your progress with ease. You can also upload attachments, leave
        comments, and collaborate with others.
      </p>
      <p>
        Get started by registering your account and exploring all the features Project Manager has to offer.
      </p>
      <Link to="/register" className="btn btn-primary btn-lg mt-4">
        Register Now
      </Link>
    </div>
  );
};

export default MainPage;
