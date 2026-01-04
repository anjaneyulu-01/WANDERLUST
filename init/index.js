require('dotenv').config();

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");
const Review = require("../models/review.js");

const MONGO_URL = process.env.ATLAS_DB_URL || "mongodb://127.0.0.1:27017/wanderlust";

mongoose.connect(MONGO_URL)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err => console.log("Connection error:", err));

const initDB = async () => {
  try {
    // Clear existing data
    await Listing.deleteMany({});
    await Review.deleteMany({});

    // Seed listings only (users added via signup)
    const createdListings = await Listing.insertMany(initData.data);
    console.log(`✅ ${createdListings.length} listings created`);
    console.log("✅ Database initialization complete!");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
};

initDB();