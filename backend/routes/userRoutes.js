const express = require('express');
const {
  registerUser,
  authUser,
  updateUserProfile,
  resetPassword,
  verifyEmail,
  setNewPassword,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(authUser);
router.route('/profile').put(protect, updateUserProfile);
router.route('/reset-password').post(resetPassword);
router.route('/reset-password/:token').post(setNewPassword); // Add this route
router.route('/verify-email/:token').get(verifyEmail);

module.exports = router;
