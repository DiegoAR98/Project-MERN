// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Print environment variables for verification
console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID);
console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY);
console.log('AWS_REGION:', process.env.AWS_REGION);

// Configure AWS SDK for S3
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

// Create the parameters for calling createBucket
const bucketName = `project-manager-attachments-${uuidv4().slice(0, 8)}`;
const bucketParams = {
  Bucket: bucketName,
};

// call S3 to create the bucket
s3.createBucket(bucketParams, (err, data) => {
  if (err) {
    console.log('Error creating bucket:', err);
  } else {
    console.log('Bucket created successfully', data.Location);
    // Create the bucket policy
    const bucketPolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'PublicReadGetObject',
          Effect: 'Allow',
          Principal: '*',
          Action: 's3:GetObject',
          Resource: `arn:aws:s3:::${bucketName}/*`
        },
        {
          Sid: 'AllowPutObject',
          Effect: 'Allow',
          Principal: {
            AWS: `arn:aws:iam::${process.env.AWS_ACCOUNT_ID}:user/IAMUSER`
          },
          Action: [
            's3:PutObject',
            's3:PutObjectAcl',
            's3:ListBucket',
            's3:DeleteObject'
          ],
          Resource: `arn:aws:s3:::${bucketName}/*`
        }
      ]
    };

    // Set the new policy on the newly created bucket
    const putPolicyParams = {
      Bucket: bucketName,
      Policy: JSON.stringify(bucketPolicy)
    };

    s3.putBucketPolicy(putPolicyParams, (err, data) => {
      if (err) {
        console.log('Error setting bucket policy:', err);
      } else {
        console.log('Bucket policy set successfully', data);
      }
    });
  }
});
