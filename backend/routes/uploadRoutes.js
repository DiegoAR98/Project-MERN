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
const upload = multer({ storage });

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

router.post('/upload', upload.single('file'), (req, res) => {
  console.log("post('/api/upload'", req.file);
  const uploadParams = params(req.file);
  s3.upload(uploadParams, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    res.json(data);
  });
});

module.exports = router;
