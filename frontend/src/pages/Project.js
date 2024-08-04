import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProjectById, updateProject, getTasks, addTask, addComment, getComments, addAttachment, getAttachments, deleteTask, deleteComment, deleteAttachment } from '../api/api';

const Project = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState({
    name: '',
    description: '',
    category: 'college',
    dueDate: '',
  });
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      const token = localStorage.getItem('token');
      const data = await getProjectById(id, token);
      setProject(data);
    };

    const fetchTasks = async () => {
      const token = localStorage.getItem('token');
      const data = await getTasks(id, token);
      setTasks(data);
    };

    const fetchComments = async () => {
      const token = localStorage.getItem('token');
      const data = await getComments(id, token);
      setComments(data);
    };

    const fetchAttachments = async () => {
      const token = localStorage.getItem('token');
      const data = await getAttachments(id, token);
      setAttachments(data);
    };

    fetchProject();
    fetchTasks();
    fetchComments();
    fetchAttachments();
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

  const handleAddTask = async () => {
    const token = localStorage.getItem('token');
    try {
      await addTask(id, { name: taskName, dueDate: taskDueDate }, token);
      const data = await getTasks(id, token);
      setTasks(data);
      setTaskName('');
      setTaskDueDate('');
    } catch (error) {
      console.error('Error adding task', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    const token = localStorage.getItem('token');
    try {
      await deleteTask(id, taskId, token);
      const data = await getTasks(id, token);
      setTasks(data);
    } catch (error) {
      console.error('Error deleting task', error);
    }
  };

  const handleAddComment = async () => {
    const token = localStorage.getItem('token');
    try {
      const newComment = await addComment(id, { text: commentText }, token);
      setComments([...comments, newComment]);
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const token = localStorage.getItem('token');
    try {
      await deleteComment(id, commentId, token);
      const data = await getComments(id, token);
      setComments(data);
    } catch (error) {
      console.error('Error deleting comment', error);
    }
  };

  const handleAddAttachment = async () => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);

    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage('Attachment not allowed. Maximum file size is 50MB.');
      return;
    }

    try {
      const newAttachment = await addAttachment(id, formData, token);
      setAttachments([...attachments, newAttachment]);
      setFile(null);
      setErrorMessage(''); // Clear error message
    } catch (error) {
      console.error('Error adding attachment', error);
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Error uploading file');
      }
    }
  };

  const handleDeleteAttachment = async (attachmentId) => {
    const token = localStorage.getItem('token');
    try {
      await deleteAttachment(id, attachmentId, token);
      const data = await getAttachments(id, token);
      setAttachments(data);
    } catch (error) {
      console.error('Error deleting attachment', error);
    }
  };

  return (
    <div className="container my-5">
      <h1 className="mb-4">Edit Project</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name:</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={project.name}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description:</label>
          <textarea
            name="description"
            className="form-control"
            value={project.description}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Category:</label>
          <select
            name="category"
            className="form-select"
            value={project.category}
            onChange={handleChange}
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
            name="dueDate"
            className="form-control"
            value={project.dueDate}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">Update</button>
      </form>

      <div className="my-5">
        <h2>Tasks</h2>
        <ul className="list-group mb-3">
          {tasks.map((task) => (
            <li key={task._id} className="list-group-item d-flex justify-content-between align-items-center">
              <Link to={`/project/${id}/task/${task._id}`}>
                {task.name} - Due: {new Date(task.dueDate).toLocaleDateString()}
              </Link>
              <button className="btn btn-danger btn-sm" onClick={() => handleDeleteTask(task._id)}>Delete</button>
            </li>
          ))}
        </ul>

        <div className="mb-3">
          <h3>Add Task</h3>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Task Name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          <input
            type="date"
            className="form-control mb-2"
            value={taskDueDate}
            onChange={(e) => setTaskDueDate(e.target.value)}
          />
          <button className="btn btn-success" onClick={handleAddTask}>Add Task</button>
        </div>
      </div>

      <div className="my-5">
        <h2>Comments</h2>
        <div className="mb-3">
          {comments.map((comment) => (
            <div key={comment._id} className="card mb-2">
              <div className="card-body">
                <p>{comment.text}</p>
                <small className="text-muted">{comment.user.name}</small>
                <button className="btn btn-danger btn-sm float-end" onClick={() => handleDeleteComment(comment._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Add a comment"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button className="btn btn-success" onClick={handleAddComment}>Add Comment</button>
      </div>

      <div className="my-5">
        <h2>Attachments</h2>
        <div className="mb-3">
          {attachments.map((attachment) => (
            <div key={attachment._id} className="d-flex justify-content-between align-items-center">
              <a href={attachment.fileUrl} target="_blank" rel="noopener noreferrer">
                {attachment.filename}
              </a>
              <small className="text-muted">{attachment.user.name}</small>
              <button className="btn btn-danger btn-sm" onClick={() => handleDeleteAttachment(attachment._id)}>Delete</button>
            </div>
          ))}
        </div>
        <input type="file" className="form-control mb-2" onChange={(e) => setFile(e.target.files[0])} />
        <button className="btn btn-success" onClick={handleAddAttachment}>Add Attachment</button>

        {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
      </div>
    </div>
  );
};

export default Project;
