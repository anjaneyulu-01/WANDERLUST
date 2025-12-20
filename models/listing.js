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
      default: "https://thumbs.dreamstime.com/z/naruto-uzomaki-d-model-picture-shows-famous-character-anime-uzumaki-forms-generate-ai-280095429.jpg"
    }
  },
  price:Number,
  location:String,
  country:String
});

const Listing = mongoose.model("Listing",listingSchema);

module.exports=Listing;