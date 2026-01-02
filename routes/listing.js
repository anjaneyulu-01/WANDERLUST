const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");

const validateListing = (req,res,next) => {
    let {error}=listingSchema.validate(req.body);
    if(error){
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400,errMsg);
    }else{
      next();
    }
}

//index route
router.get("/",async(req,res)=>{
 const allListings = await Listing.find({});
res.render("listings/index",{allListings});
});

//Create route

router.get("/new",(req,res)=>{
  res.render("listings/new.ejs");
});

router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);


//show route

router.get("/:id",async (req,res)=>{
 let {id}=req.params;
 let listing= await Listing.findById(id).populate("reviews");
 res.render("listings/show.ejs",{listing});
});

//Update route

router.get("/:id/edit",async (req,res)=>{
 let {id}=req.params;
 let listing= await Listing.findById(id);
 res.render("listings/edit.ejs",{listing})
});

router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
  const { id } = req.params;
 await Listing.findByIdAndUpdate(id,{...req.body.listing});
 res.redirect(`/listings/${id}`);
})
);

//DELETE route

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  let list=await Listing.findByIdAndDelete(id);
  console.log(list);
  res.redirect("/listings");
});


module.exports = router;