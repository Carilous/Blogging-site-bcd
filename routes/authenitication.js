const express = require('express');
const upload = require('../config/multer');
const router = express.Router();
const { signup, login , me} = require('../controller/authController');
const {
    getUsers,
    getUserById,
    deleteUser

}= require('../controller/authController');
router.post("/signup", upload.single("profilePicture"), signup);
router.post('/login', login);
router.get('/me', me);
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.delete('/users/:id', deleteUser);
module.exports = router;