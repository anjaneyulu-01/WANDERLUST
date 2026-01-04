const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const { cloudinary } = require("../config/cloudinary.js");

// Helper function to safely delete images from Cloudinary
const deleteCloudinaryImage = async (filename) => {
  try {
    // Only attempt to delete if Cloudinary is configured with real credentials
    if (process.env.CLOUD_NAME && 
        process.env.CLOUD_API_KEY && 
        process.env.CLOUD_API_SECRET &&
        !process.env.CLOUD_NAME.includes("your_")) {
      await cloudinary.uploader.destroy(filename);
    }
  } catch (err) {
    console.log("Warning: Could not delete image from storage:", err.message);
  }
};

// Normalize uploaded file info so the browser can load it
// If using Cloudinary: file.path is already a public https URL
// If using local disk: expose it under /uploads/<filename>
const buildImagePayload = (file) => {
  if (!file) return null;
  const isCloudUrl = file.path && file.path.startsWith("http");
  return {
    url: isCloudUrl ? file.path : `/uploads/${file.filename}`,
    filename: file.filename,
  };
};

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.index = async (req, res) => {
  const { category } = req.query;
  let filter = {};
  
  if (category && category !== 'all') {
    // Convert URL format (e.g., 'iconic-cities') to model format (e.g., 'Iconic Cities')
    const categoryMap = {
      'trending': 'Trending',
      'rooms': 'Rooms',
      'iconic-cities': 'Iconic Cities',
      'castles': 'Castles',
      'pools': 'Pools',
      'camping': 'Camping',
      'farms': 'Farms',
      'arctic': 'Arctic',
      'beach': 'Beach',
      'mountains': 'Mountains'
    };
    filter.category = categoryMap[category];
  }
  
  const allListings = await Listing.find(filter);
  res.render("listings/index", { allListings, selectedCategory: category || 'all' });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  
  // Handle file upload (Cloudinary)
  if (req.file) {
    const image = buildImagePayload(req.file);
    if (image) {
      newListing.image = image;
    }
  }
  
  await newListing.save();
  req.flash("success", "New listing Created");
  res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body.listing };
  
  // Get existing listing to check if we need to delete old image
  const existingListing = await Listing.findById(id);
  if (!existingListing) {
    req.flash("error", "Listing you want to edit does not exist");
    return res.redirect("/listings");
  }
  
  // Handle file upload (Cloudinary)
  if (req.file) {
    // Delete old image from Cloudinary if it exists
    if (existingListing.image && existingListing.image.filename) {
      await deleteCloudinaryImage(existingListing.image.filename);
    }
    
    // Set new image
    const image = buildImagePayload(req.file);
    if (image) {
      updateData.image = image;
    }
  } else if (!updateData.image || !updateData.image.url) {
    // If no file uploaded and no URL provided, remove image from updateData
    // This will preserve the existing image in the database
    delete updateData.image;
  }
  
  const listing = await Listing.findByIdAndUpdate(id, updateData);
  req.flash("success", "listing updated");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  let list = await Listing.findByIdAndDelete(id);
  if (!list) {
    req.flash("error", "Listing you want to delete does not exist");
    return res.redirect("/listings");
  }
  
  // Delete image from Cloudinary if it exists
  if (list.image && list.image.filename) {
    await deleteCloudinaryImage(list.image.filename);
  }
  
  req.flash("success", "listing Deleted");
  res.redirect("/listings");
};
