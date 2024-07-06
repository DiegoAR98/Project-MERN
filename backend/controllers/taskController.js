const asyncHandler = require('express-async-handler');
const Project = require('../models/Project');
const moment = require('moment-timezone');

const addTask = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.projectId);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }
  if (project.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }
  const { name, dueDate } = req.body;
  const task = { name, dueDate: moment.tz(dueDate, 'America/New_York').toDate() };
  project.tasks.push(task);
  await project.save();
  res.status(201).json(project.tasks);
});

const updateTask = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.projectId);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }
  if (project.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }
  const task = project.tasks.id(req.params.taskId);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  task.name = req.body.name || task.name;
  task.dueDate = req.body.dueDate ? moment.tz(req.body.dueDate, 'America/New_York').toDate() : task.dueDate;
  task.isComplete = req.body.isComplete !== undefined ? req.body.isComplete : task.isComplete;
  await project.save();
  res.status(200).json(task);
});

const deleteTask = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.projectId);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }
  if (project.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }
  const task = project.tasks.id(req.params.taskId);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  task.remove();
  await project.save();
  res.status(200).json({ message: 'Task removed' });
});

const getTasks = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.projectId);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }
  if (project.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }
  res.status(200).json(project.tasks);
});

const markTaskComplete = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.projectId);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }
  if (project.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }
  const task = project.tasks.id(req.params.taskId);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  task.isComplete = true;
  await project.save();
  res.status(200).json(task);
});

const getTaskById = asyncHandler(async (req, res) => {
  const { projectId, taskId } = req.params;
  console.log(`Fetching task: Project ID - ${projectId}, Task ID - ${taskId}`);
  
  const project = await Project.findById(projectId);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }
  if (project.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }
  const task = project.tasks.id(taskId);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  res.status(200).json(task);
});

module.exports = {
  addTask,
  updateTask,
  deleteTask,
  getTasks,
  getTaskById,
  markTaskComplete,
};
