const express=require("express");
const app=express();
const mongoose = require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
main().then((res)=>{
 console.log("connected to Db");
}).catch((err)=>{
  console.log(err);
})

async function main(){
 await mongoose.connect(MONGO_URL);
}

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
// Parse JSON bodies (if needed for APIs)
app.use(express.json());
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req,res)=>{
  res.send("hey hii");
});


app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

app.use((req,res,next)=>{
  next(new ExpressError(404,"Page Not Found"));
});

app.use((err,req,res,next)=>{
let {statusCode=500, message="something went wrong"} = err;
res.status(statusCode).render("error.ejs",{message})
// res.status(statusCode).send(message);
}); 

app.listen(3006,()=>{
  console.log("server is listening to port : 3006");
});