const express = require("express");
const protect = require("../middleware/auth");
const router = express.Router();

const {
  getAllPosts,
  createPost,
  getPostById,
  updatePost,
  commentOnPost,
  deletePost,
} = require("../controller/postController");


const upload = require("../config/multer");

// Routes
router.get("/posts", getAllPosts);
router.get("/:id", getPostById);
router.post("/newpost",protect, upload.single("file"), createPost);
router.put("/edit/:id", upload.single("file"), updatePost);
router.delete("/delete/:id", deletePost);
// Add comment to a specific post
router.post("/:id/comment", protect, commentOnPost);


module.exports = router;
