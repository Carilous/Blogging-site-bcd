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

// ✅ only use the upload exported from middleware
const upload = require("../config/multer");

// Routes
router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.post("/newpost",protect, upload.single("file"), createPost);
router.put("/edit/:id", upload.single("file"), updatePost);
router.delete("/delete/:id", deletePost);
router.post("/comment", commentOnPost);

module.exports = router;
