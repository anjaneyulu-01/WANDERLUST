module.exports.isLoggedIn=(req,res,next)=>{
   if(!req.isAuthenticated()){
    // remember where the user wanted to go; keep existing value if already set
    if (!req.session.returnTo) {
      // for GET, use originalUrl; for POST (forms), fall back to Referrer if present
      req.session.returnTo = req.method === "GET" ? req.originalUrl : (req.get("Referrer") || req.originalUrl);
    }
    req.flash("error","To create Listing you should loged in");
   return res.redirect("/login");
  }
  next();
}

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const Listing = require("./models/listing.js");
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  if (!listing.owner.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that");
    return res.redirect(`/listings/${id}`);
  }
  next();
}