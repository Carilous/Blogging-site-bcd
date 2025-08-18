const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;


mongoose
  .connect(MONGODB_URI, {
    
  })
  .then(() => {
    console.log("✅ Connected to the database successfully");
  })
  .catch((err) => {
    console.error(" Failed to connect to the database", err);
    process.exit(1); // stop the app so Render knows it failed
  });

module.exports = mongoose;
