const express = require('express');
const router = express.Router();
const multer = require('multer');
require('dotenv').config();
const AWS = require('aws-sdk');

const storage = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, '');
  },
});

// Image is the key!
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB file size limit
});

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const params = (file) => {
  const myFile = file.originalname.split('.');
  const fileType = myFile[myFile.length - 1];

  return {
    Bucket: 'projectuploadsmern', // Hardcode the bucket name here
    Key: `${Date.now()}-${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };
};

router.post('/upload', (req, res) => {
  upload.single('file')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      console.error('Multer error:', err);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'Attachment not allowed. Maximum limit per user is 50MB.' });
      }
      return res.status(500).json({ message: 'Multer error occurred when uploading.', error: err.message });
    } else if (err) {
      // An unknown error occurred when uploading.
      console.error('Unknown error:', err);
      return res.status(500).json({ message: 'Server error', error: err.message });
    }

    // No errors occurred.
    if (!req.file) {
      console.error('No file uploaded');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const uploadParams = params(req.file);
    s3.upload(uploadParams, (err, data) => {
      if (err) {
        console.error('S3 upload error:', err);
        return res.status(500).send(err);
      }
      res.json(data);
    });
  });
});

module.exports = router;
