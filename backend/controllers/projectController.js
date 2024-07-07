const asyncHandler = require('express-async-handler');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const Project = require('../models/Project');
const Comment = require('../models/Comment');
const Attachment = require('../models/Attachment');
require('dotenv').config();

// Configure AWS SDK
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  endpoint: `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com`, // Ensure correct endpoint
});

// Set up multer to use S3 for storage
const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: 'public-read',
    key: (req, file, cb) => {
      cb(null, `${Date.now()}-${path.basename(file.originalname)}`);
    },
  }),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB file size limit
});
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
const addAttachment = [
  upload.single('file'),
  asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    const attachment = new Attachment({
      project: req.params.projectId,
      user: req.user._id,
      filename: req.file.originalname,
      fileUrl: req.file.location, // URL from S3
    });

    await attachment.save();

    project.attachments.push(attachment._id);
    await project.save();

    res.status(201).json(attachment);
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
