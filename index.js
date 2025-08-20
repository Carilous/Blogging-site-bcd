
const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./config/db'); 

// Utils
const cloudinary = require('./utils/cloudinary');

// Routes
const authRoutes = require('./routes/authenitication');
const postRoutes = require('./routes/posts');


const app = express();
const PORT = process.env.PORT || 4000;


app.use(cors());
app.use(express.json());

// Static folders
app.use('/uploads', express.static('uploads'));
app.use('/public', express.static('public'));
//routes
app.use('/auth', authRoutes);
app.use('/posts', postRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Blogging Backend API' });
});
app.use("/uploads", express.static("uploads"));
// Cloudinary configuration



// Error Handling

app.use((err, req, res, next) => {
  console.error("Error middleware:", err);

  if (err.name === "MulterError") {
    return res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }

  res.status(500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
