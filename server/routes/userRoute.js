const express = require('express');
const router = express.Router();
const User = require('../model/user');
const { registerUser, loginUser} = require('../controllers/userController');
const validateNewUser = require('../middleware/validateNewUser');

router.post('/register',validateNewUser,registerUser);
router.post('/login', loginUser);

module.exports = router;