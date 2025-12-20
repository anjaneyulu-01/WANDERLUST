const mongoose = require("mongoose");
const Schema=mongoose.Schema;

const listingSchema = new Schema({
  title:
  {
    type:String,
    required:true
  },
  description:String,
 image: {
  filename: {
    type: String,
    default: "listingimage"
  },
  url: {
    type: String,
    default: "https://s-i.huffpost.com/gen/1168191/images/o-BEACH-HOUSES-facebook.jpg",
    set: v => v === "" ? undefined : v
  }
  },

  price:Number,
  location:String,
  country:String
});

const Listing = mongoose.model("Listing",listingSchema);

module.exports=Listing;