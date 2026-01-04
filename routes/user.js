const express = require("express");
const router = express.Router();
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const userController = require("../controllers/user.js");

router
  .route("/signup")
  .get(userController.renderSignup)
  .post(wrapAsync(userController.signup));

router
  .route("/login")
  .get(userController.renderLogin)
  .post(
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
      keepSessionInfo: true, // preserve returnTo set before login
    }),
    userController.login
  );

router.get("/logout", userController.logout);

module.exports = router;