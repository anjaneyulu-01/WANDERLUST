require("dotenv").config();

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");
const Review = require("../models/review.js");

const MONGO_URL = process.env.ATLAS_DB_URL;

if (!MONGO_URL) {
  console.error("❌ ATLAS_DB_URL is not defined in environment variables");
  process.exit(1);
}

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

const initDB = async () => {
  try {
    // Clear existing data
    await Listing.deleteMany({});
    await Review.deleteMany({});

    // Get existing users
    const users = await User.find({});

    if (!users.length) {
      console.log(
        "⚠️ No users found. Please sign up users before running the seeder."
      );
      process.exit(1);
    }

    // Assign owners to listings
    const listingsWithOwner = initData.data.map((listing, index) => ({
      ...listing,
      owner: users[index % users.length]._id,
    }));

    const createdListings = await Listing.insertMany(listingsWithOwner);

    console.log(`✅ ${createdListings.length} listings created`);
    console.log("🎉 Database initialization complete!");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error initializing database:", err);
    process.exit(1);
  }
};

initDB();
