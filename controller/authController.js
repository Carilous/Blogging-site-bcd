
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const cloudinary = require('../utils/cloudinary');

// creatinng a token for user authentication
const createToken = (Userid) => {
    return jwt.sign({ id: User._id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
}
// Middleware to authenticate user sign up 
exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // Check existing user
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Upload profile picture if exists
    let profilePicture = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload_stream(
        { folder: "profile_pics" },
        (error, uploaded) => {
          if (error) throw error;
          profilePicture = uploaded.secure_url;
        }
      );

     
      const stream = require("stream");
      const bufferStream = new stream.PassThrough();
      bufferStream.end(req.file.buffer);
      bufferStream.pipe(result);
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      profilePicture,
    });

    const token = createToken(user._id);

    res.status(201).json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error signing up", error: err.message });
  }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required ' });
    }
    // Check if user exists
    const user= await User.findOne({email})
    if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    // Create token
    
    const token = createToken(user._id);
    res.status(200).json({
        user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
        },
        token,
    });
}
exports.me = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); 
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};


exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
};

//  Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};


