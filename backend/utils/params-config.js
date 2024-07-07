require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');

// Configure AWS SDK for S3
AWS.config.update({
  region: process.env.AWS_REGION,  // Ensure this points to us-east-1 for S3
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();

const params = (file) => {
  const myFile = file.originalname.split('.');
  const fileType = myFile[myFile.length - 1];

  const imageParams = {
    Bucket: process.env.S3_BUCKET_NAME, // Use environment variable
    Key: `${uuidv4()}.${fileType}`,
    Body: file.buffer,
    ContentType: file.mimetype // Set the content type
  };

  return imageParams;
};

module.exports = params;
