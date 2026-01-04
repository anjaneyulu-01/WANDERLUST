const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn} = require("../middleware.js");
const reviewController = require("../controllers/review.js");

router
	.route("/")
	.post(isLoggedIn, reviewController.validateReview, wrapAsync(reviewController.createReview));

router
	.route("/:reviewId")
	.delete(isLoggedIn, wrapAsync(reviewController.deleteReview));

module.exports = router;