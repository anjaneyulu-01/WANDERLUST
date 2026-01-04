const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const { cloudinary } = require("../config/cloudinary.js");

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
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  
  // Handle file upload (Cloudinary)
  if (req.file) {
    newListing.image.url = req.file.path;
    newListing.image.filename = req.file.filename;
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
      try {
        await cloudinary.uploader.destroy(existingListing.image.filename);
      } catch (err) {
        console.log("Error deleting old image from Cloudinary:", err);
      }
    }
    
    // Set new image
    updateData.image = { 
      url: req.file.path,
      filename: req.file.filename 
    };
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
    try {
      await cloudinary.uploader.destroy(list.image.filename);
    } catch (err) {
      console.log("Error deleting image from Cloudinary:", err);
    }
  }
  
  req.flash("success", "listing Deleted");
  res.redirect("/listings");
};
