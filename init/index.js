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
    await User.deleteMany({});

    // Create test users
    const users = await User.create([
      {
        username: "anji",
        email: "anji@wanderlust.com",
        password: "anji"
      },
      {
        username: "rahul",
        email: "rahul@wanderlust.com",
        password: "rahul"
      },
      {
        username: "santhosh",
        email: "santhosh@wanderlust.com",
        password: "santhosh"
      },
      {
        username: "akash",
        email: "akash@wanderlust.com",
        password: "akash"
      },
      {
        username: "ashok",
        email: "ashok@wanderlust.com",
        password: "ashok"
      },
      {
        username: "ashrith",
        email: "ashrith@wanderlust.com",
        password: "ashrith"
      },
      {
        username: "abhi",
        email: "abhi@wanderlust.com",
        password: "abhi"
      }
    ]);

    console.log(`✅ ${users.length} users created`);

    // Create listings with distributed ownership
    const listingsWithOwner = initData.data.map((listing, index) => ({
      ...listing,
      owner: users[index % users.length]._id
    }));

    const createdListings = await Listing.insertMany(listingsWithOwner);
    console.log(`✅ ${createdListings.length} listings created`);
    console.log("✅ Database initialization complete!");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
};

initDB();