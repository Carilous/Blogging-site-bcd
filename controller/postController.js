const BlogPost = require('../models/BlogPost');
const Comments = require('../models/Comments');


const cloudinary = require('../utils/cloudinary');

// Getting all posts
const getAllPosts = async (req, res) => {
  try {
    let posts = await BlogPost.find()
      .populate("author", "email username profilePicture")
      .sort({ createdAt: -1 }); // optional: newest first

    // Ensure local uploads get full URL (not just filename)
    posts = posts.map((post) => {
      if (post.imageUrl && !post.imageUrl.startsWith("http")) {
        post.imageUrl = `${req.protocol}://${req.get("host")}/uploads/${post.imageUrl}`;
      }
      return post;
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Error fetching posts" });
  }
};


// Getting a single post
const getPostById = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await BlogPost.findById(id)
            .populate('author', 'email username profilePicture');
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching post' });
    }
};

// Creating a new post

const createPost = async (req, res) => {
  const { title, content, subtitle,tags } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  try {
   // Upload image if provided
    let imageUrl = "https://example.com/default-image.png";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
    }

    const newPost = await BlogPost.create({
      title,
      subtitle: subtitle || "",
      content,
      image: cloudImage ? cloudImage.secure_url : "", // safe fallback
      userImageID: cloudImage ? cloudImage.public_id : null,
      author: req.user._id,
        tags: tags ? tags.split(",") : [],
    });

    res.status(201).json({
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating post", error: error.message });
  }
};


// Updating a post
const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, } = req.body;
        if (!title || !content ) {
            return res.status(400).json({ message: 'Title and content are required' });
        }
        let imageUrl = '';
        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path);
                imageUrl = result.secure_url;
            } catch (error) {
                return res.status(500).json({ message: 'Error uploading image' });
            }
        }
        const updatedPost = await BlogPost.findByIdAndUpdate(
            id,
            {
                title,
                subtitle: req.body.subtitle || '',
                content,
                image: imageUrl
            },
            { new: true }
        );
        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json({
            message: 'Post updated successfully',
            post: updatedPost
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating post' });
    }
};

// Deleting a post
const deletePost = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedPost = await BlogPost.findByIdAndDelete(id);
        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting post' });
    }
};
//commenting on a post
const commentOnPost = async (req, res) => {
    const { postId, text } = req.body;
    if (!postId || !text) {
        return res.status(400).json({ message: 'Post ID and text are required' });
    }
    try {
        const comment = await Comments.create({
            post: postId,
            user: req.user._id,
            text
        });
        res.status(201).json({
            message: 'Comment added successfully',
            comment
        });
    } catch (error) {
        res.status(500).json({ message: 'Error adding comment', error: error.message });
    }
};

module.exports = {
    commentOnPost,
    getAllPosts,
    createPost,
    getPostById,
    updatePost,
    deletePost
};
