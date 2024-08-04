import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTaskById, updateTask, deleteTask, markTaskComplete } from '../api/api';

const Task = () => {
  const { projectId, taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState({ name: '', dueDate: '', isComplete: false });
  const [name, setName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      const token = localStorage.getItem('token');
      try {
        const data = await getTaskById(projectId, taskId, token);
        setTask(data);
        setName(data.name);
        setDueDate(data.dueDate.split('T')[0]);  // Ensure dueDate is properly formatted for input
        setIsComplete(data.isComplete);
      } catch (error) {
        console.error('Error fetching task', error);
      }
    };
    fetchTask();
  }, [projectId, taskId]);

  const handleUpdate = async () => {
    const token = localStorage.getItem('token');
    try {
      await updateTask(projectId, taskId, { name, dueDate, isComplete }, token);
      navigate(`/project/${projectId}`);
    } catch (error) {
      console.error('Error updating task', error);
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      await deleteTask(projectId, taskId, token);
      navigate(`/project/${projectId}`);
    } catch (error) {
      console.error('Error deleting task', error);
    }
  };

  const handleMarkComplete = async () => {
    const token = localStorage.getItem('token');
    try {
      await markTaskComplete(projectId, taskId, token);
      setIsComplete(true);
    } catch (error) {
      console.error('Error marking task as complete', error);
    }
  };

  return (
    <div className="container my-5">
      <h1 className="mb-4">Task Details</h1>
      <form>
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
          <label className="form-label">Due Date:</label>
          <input
            type="date"
            className="form-control"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            checked={isComplete}
            onChange={(e) => setIsComplete(e.target.checked)}
          />
          <label className="form-check-label">Complete</label>
        </div>
        <button type="button" className="btn btn-primary me-2" onClick={handleUpdate}>Update Task</button>
        <button type="button" className="btn btn-danger me-2" onClick={handleDelete}>Delete Task</button>
        <button type="button" className="btn btn-success" onClick={handleMarkComplete}>Mark as Complete</button>
      </form>
    </div>
  );
};

export default Task;
