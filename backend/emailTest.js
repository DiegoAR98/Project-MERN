require('dotenv').config();
const sendEmail = require('./utils/sendEmail');

const testEmail = async () => {
  try {
    await sendEmail({
      to: 'projectmanagermern@outlook.com',  // Replace with your actual email address
      subject: 'Test Email',
      text: 'This is a test email from your Project Manager application.'
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email', error);
  }
};

testEmail();
