const express = require('express');
const {
  registerUser,
  signInUser,
  getAdmin
} = require('../controllers/authenticate');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.post('/register', registerUser);
router.post('/authenticate/signin', signInUser);
router.get('/admin', protect, getAdmin);
module.exports = router;
