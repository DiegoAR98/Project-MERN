const express = require('express');
const {
  addTask,
  updateTask,
  deleteTask,
  getTasks,
  markTaskComplete,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router({ mergeParams: true });

router.route('/').post(protect, addTask).get(protect, getTasks);
router
  .route('/:taskId')
  .put(protect, updateTask)
  .delete(protect, deleteTask);
router.route('/:taskId/complete').put(protect, markTaskComplete);

module.exports = router;
