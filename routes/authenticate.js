const express = require('express');
const {
  registerUser,
  signInUser,
  getAdmin,
  resetPassword,
  resetPasswordUsingToken,
  updateUserDetails,updateUserPassword
} = require('../controllers/authenticate');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.post('/register', registerUser);
router.post('/authenticate/signin', signInUser);
router.get('/admin', protect, getAdmin);
router.post('/resetpassword', resetPassword);
router.put('/resetpassword/:resettoken', resetPasswordUsingToken);
router.put('/updateuser', protect, updateUserDetails);
router.put('/updatepassword', protect, updateUserPassword);
module.exports = router;
