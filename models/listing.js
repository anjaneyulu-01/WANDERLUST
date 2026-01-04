const mongoose = require("mongoose");
const Schema=mongoose.Schema;
const Review = require("./review.js");
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
  country:String,
  category: {
    type: String,
    enum: ['Trending', 'Rooms', 'Iconic Cities', 'Castles', 'Pools', 'Camping', 'Farms', 'Arctic', 'Beach', 'Mountains'],
    default: 'Trending'
  },
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reviews:[
    {
      type: Schema.Types.ObjectId,
      ref:"Review",
    },
  ]
});

listingSchema.post("findOneAndDelete",async(listing) =>{
  if(listing){
    await Review.deleteMany({_id : {$in : listing.reviews}});
  }
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports=Listing;