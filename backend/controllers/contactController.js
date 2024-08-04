const asyncHandler = require('express-async-handler');
const sendEmail = require('../utils/sendEmail');

// @desc    Send contact email
// @route   POST /api/contact
// @access  Public
const sendContactEmail = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  const emailContent = `
    Name: ${name}
    Email: ${email}
    Message: ${message}
  `;

  await sendEmail({
    to: process.env.EMAIL_USERNAME, // Your contact email address
    subject: 'Contact Form Submission',
    text: emailContent,
  });

  res.status(200).json({ message: 'Email sent successfully' });
});

module.exports = { sendContactEmail };
