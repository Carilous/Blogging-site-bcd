const express = require('express');
const upload = require('../config/multer');
const router = express.Router();
const { signup, login , me} = require('../controller/authController');
router.post("/signup", upload.single("profilePicture"), signup);
router.post('/login', login);
router.get('/me', me);
module.exports = router;