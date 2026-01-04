const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner}=require("../middleware.js");
const listingController = require("../controllers/listing.js");
const { upload } = require("../config/cloudinary.js");

// index + create
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    listingController.validateListing,
    wrapAsync(listingController.createListing)
  );

// new form
router.get("/new", isLoggedIn, listingController.renderNewForm);

// show, update, delete
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    listingController.validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// edit form
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;