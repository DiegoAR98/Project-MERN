const asyncHandler = require('express-async-handler');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const Project = require('../models/Project');
const Comment = require('../models/Comment');
const Attachment = require('../models/Attachment');
require('dotenv').config();

const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

const params = (file) => {
  const myFile = file.originalname.split('.');
  const fileType = myFile[myFile.length - 1];

  return {
    Bucket: 'projectuploadsmern', // Hardcoded bucket name
    Key: `${Date.now()}-${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };
};

// @desc    Get all projects for a user
// @route   GET /api/projects
// @access  Private
const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ user: req.user._id });
  res.json(projects);
});

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project && project.user.toString() === req.user._id.toString()) {
    res.json(project);
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
const createProject = asyncHandler(async (req, res) => {
  const { name, description, category, dueDate } = req.body;

  const project = new Project({
    user: req.user._id,
    name,
    description,
    category,
    dueDate,
  });

  const createdProject = await project.save();
  res.status(201).json(createdProject);
});

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = asyncHandler(async (req, res) => {
  const { name, description, category, dueDate } = req.body;

  const project = await Project.findById(req.params.id);

  if (project && project.user.toString() === req.user._id.toString()) {
    project.name = name || project.name;
    project.description = description || project.description;
    project.category = category || project.category;
    project.dueDate = dueDate || project.dueDate;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project && project.user.toString() === req.user._id.toString()) {
    await project.remove();
    res.json({ message: 'Project removed' });
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

// @desc    Add a comment to a project
// @route   POST /api/projects/:projectId/comments
// @access  Private
const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const project = await Project.findById(req.params.projectId);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const comment = new Comment({
    project: req.params.projectId,
    user: req.user._id,
    text,
  });

  await comment.save();

  res.status(201).json(comment);
});

// @desc    Get comments for a project
// @route   GET /api/projects/:projectId/comments
// @access  Private
const getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ project: req.params.projectId }).populate('user', 'name');

  res.status(200).json(comments);
});

// @desc    Add an attachment to a project
// @route   POST /api/projects/:projectId/attachments
// @access  Private

// Attachment route
const addAttachment = [
  upload.single('file'),
  asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    if (!req.file) {
      res.status(400);
      throw new Error('No file uploaded');
    }

    const uploadParams = params(req.file);
    s3.upload(uploadParams, async (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
      } else {
        const attachment = new Attachment({
          project: req.params.projectId,
          user: req.user._id,
          filename: req.file.originalname,
          fileUrl: data.Location,
        });

        await attachment.save();

        project.attachments.push(attachment._id);
        await project.save();

        res.status(201).json(attachment);
      }
    });
  }),
];


// @desc    Get attachments for a project
// @route   GET /api/projects/:projectId/attachments
// @access  Private
const getAttachments = asyncHandler(async (req, res) => {
  const attachments = await Attachment.find({ project: req.params.projectId }).populate('user', 'name');

  res.status(200).json(attachments);
});

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addComment,
  getComments,
  addAttachment,
  getAttachments,
};
