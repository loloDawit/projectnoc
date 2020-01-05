const express = require('express');
const { registerUser, signInUser } = require('../controllers/authenticate');

const router = express.Router();

router.post('/register', registerUser);
router.post('/authenticate/signin', signInUser);

module.exports = router;
