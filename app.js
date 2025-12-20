const express=require("express");
const app=express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

// Parse URL-encoded form bodies

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
// Parse JSON bodies (if needed for APIs)
app.use(express.json());
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

main().then((res)=>{
 console.log("connected to Db");
}).catch((err)=>{
  console.log(err);
})

async function main(){
 await mongoose.connect(MONGO_URL);
}

app.get("/",(req,res)=>{
  res.send("hey hii");
});
//index route
app.get("/listings",async(req,res)=>{
 const allListings = await Listing.find({})
res.render("listings/index",{allListings});
});

//Create route

app.get("/listings/new",(req,res)=>{
  res.render("listings/new.ejs");
});

app.post("/listings",async (req,res)=>{
const newlisting=new Listing(req.body.listing);
await newlisting.save();
res.redirect("/listings");
})

//show route

app.get("/listings/:id",async (req,res)=>{
 let {id}=req.params;
 let listing= await Listing.findById(id);
 res.render("listings/show.ejs",{listing});
});

//Edit route

app.get("/listings/:id/edit",async (req,res)=>{
 let {id}=req.params;
 let listing= await Listing.findById(id);
 res.render("listings/edit.ejs",{listing})
});

app.put("/listings/:id", async (req, res) => {
  const { id } = req.params;
 await Listing.findByIdAndUpdate(id,{...req.body.listing});
 res.redirect(`/listings/${id}`);
});

//DELETE route

app.delete("/listings/:id", async (req, res) => {
  const { id } = req.params;
  let list=await Listing.findByIdAndDelete(id);
  console.log(list);
  res.redirect("/listings");
});


// app.get("/testListing",async (req,res)=>{
//  let sampleListing = new Listing({
//   title:"My home",
//   description:"iam came here to buy new house",
//   price:20000,
//   location:"hyderbad",
//   country:"india"
//  });
//  await sampleListing.save();
//   console.log("data is saved in the db");
//   res.send("the page is working");
// })


app.listen(3006,()=>{
  console.log("server is listening to port : 3006");
});