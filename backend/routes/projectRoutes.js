const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addComment,
  getComments,
  deleteComment,
  addAttachment,
  getAttachments,
  deleteAttachment,
} = require('../controllers/projectController');

const {
  addTask,
  updateTask,
  deleteTask,
  getTasks,
  getTaskById,
  markTaskComplete,
} = require('../controllers/taskController');

router.route('/')
  .get(protect, getProjects)
  .post(protect, createProject);

router.route('/:id')
  .get(protect, getProjectById)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

// Task routes
router.route('/:projectId/tasks')
  .get(protect, getTasks)
  .post(protect, addTask);

router.route('/:projectId/tasks/:taskId')
  .get(protect, getTaskById)
  .put(protect, updateTask)
  .delete(protect, deleteTask);

router.route('/:projectId/tasks/:taskId/complete')
  .put(protect, markTaskComplete);

// Comment routes
router.route('/:projectId/comments')
  .get(protect, getComments)
  .post(protect, addComment);

router.route('/:projectId/comments/:commentId')
  .delete(protect, deleteComment);

// Attachment routes
router.route('/:projectId/attachments')
  .get(protect, getAttachments)
  .post(protect, addAttachment);

router.route('/:projectId/attachments/:attachmentId')
  .delete(protect, deleteAttachment);

module.exports = router;
