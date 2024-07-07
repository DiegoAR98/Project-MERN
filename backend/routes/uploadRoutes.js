const express = require('express');
const router = express.Router();
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const path = require('path');
require('dotenv').config();

// Configure AWS SDK
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: `https://s3.${process.env.AWS_REGION}.amazonaws.com`, // Ensure this endpoint is correct
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Set up multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

const params = (file) => {
  const myFile = file.originalname.split('.');
  const fileType = myFile[myFile.length - 1];

  return {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${Date.now()}-${path.basename(file.originalname)}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };
};

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).send('No file uploaded.');
    }

    const uploadParams = params(file);
    const upload = new Upload({
      client: s3,
      params: uploadParams,
    });

    const data = await upload.done();
    res.status(200).json({ message: 'File uploaded successfully', data });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
