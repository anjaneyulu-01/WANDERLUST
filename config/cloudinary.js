const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configure Cloudinary - only if credentials are provided
let storage;
let upload;

if (process.env.CLOUD_NAME && 
    process.env.CLOUD_API_KEY && 
    process.env.CLOUD_API_SECRET &&
    !process.env.CLOUD_NAME.includes("your_")) {
  
  // Real credentials provided - use Cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  });

  // Configure Cloudinary storage for multer
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "wanderlust/listings",
      allowed_formats: ["jpg", "jpeg", "png", "gif"],
      resource_type: "auto",
    },
  });

  upload = multer({ storage: storage });
} else {
  // No real credentials - use local disk storage for development
  console.log("⚠️  Cloudinary credentials not configured. Using local disk storage for images.");
  
  const path = require("path");
  const localStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "../public/uploads"));
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });
  
  upload = multer({ storage: localStorage });
}

module.exports = { cloudinary, upload };
