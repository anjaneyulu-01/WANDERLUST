const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "wanderlust/listings",
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
    resource_type: "auto",
  },
});

// Create upload middleware
const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };
