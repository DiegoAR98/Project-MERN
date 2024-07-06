import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getTaskById, updateTask, deleteTask, markTaskComplete } from '../api/api';

const Task = () => {
  const { projectId, taskId } = useParams();
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
    } catch (error) {
      console.error('Error updating task', error);
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      await deleteTask(projectId, taskId, token);
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
    <div>
      <h1>Task Details</h1>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label>Due Date:</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={isComplete}
            onChange={(e) => setIsComplete(e.target.checked)}
          />
          Complete
        </label>
      </div>
      <button onClick={handleUpdate}>Update Task</button>
      <button onClick={handleDelete}>Delete Task</button>
      <button onClick={handleMarkComplete}>Mark as Complete</button>
    </div>
  );
};

export default Task;
