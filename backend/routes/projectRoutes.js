const express = require('express');
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  uploadAttachment,
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const router = express.Router();
const mongoose = require('mongoose');

const storage = new GridFsStorage({
  url: process.env.MONGODB_CONNECTION_STRING,
  file: (req, file) => {
    return {
      bucketName: 'uploads', // collection name in MongoDB
      filename: `${Date.now()}-${file.originalname}`,
    };
  },
});

const upload = multer({ storage });

router.route('/').get(protect, getProjects).post(protect, createProject);
router
  .route('/:id')
  .get(protect, getProjectById)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

router.route('/:id/attachments').post(protect, upload.single('file'), uploadAttachment);

module.exports = router;
