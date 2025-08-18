const express = require('express');
const app = express();
const PORT = process.env.PORT ||4000
const cors = require('cors');
//importing routes
require('./config/db');
require('dotenv').config();
const authRoutes = require('./routes/authenitication');
const postRoutes = require('./routes/posts');
const cloudinary = require('./utils/cloudinary');
//middleware
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/posts', postRoutes);

app.use('/uploads', express.static('uploads'));

app.use('/public', express.static('public'));

app.use(cors());

app.use((err, req, res, next) => {
  console.error("Error middleware:", err); // log full error in terminal

  if (err.name === "MulterError") {
  
    return res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }

  // Handle all other errors
  res.status(500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});




app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the Blogging Backend API'
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);


});