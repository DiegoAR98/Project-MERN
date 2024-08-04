import React from 'react';
import { Link } from 'react-router-dom';

const MainPage = () => {
  return (
    <div className="container text-center my-5">
      <div className="jumbotron bg-light p-5 rounded">
        <h1 className="display-4">Welcome to Project Manager</h1>
        <p className="lead mt-4">
          Take control of your projects like never before! Whether you're juggling school assignments, work tasks,
          or personal projects, Project Manager is your go-to tool for organizing and tracking your progress.
        </p>
        <hr className="my-4" />
        <p className="mb-4">
          Easily create projects, add tasks, upload attachments, and stay on top of your goals. Collaborate with
          others through comments, and ensure nothing falls through the cracks.
        </p>
        <p className="mb-4">
          Ready to get started? Register now and start exploring all the powerful features Project Manager has
          to offer!
        </p>
        <Link to="/register" className="btn btn-primary btn-lg mt-4 px-5">
          Register Now
        </Link>
      </div>
    </div>
  );
};

export default MainPage;
