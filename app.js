if(!process.env.NODE_ENV!="production"){
  require('dotenv').config();
}

const express=require("express");
const app=express();
const mongoose = require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const DB_URL=process.env.ATLAS_DB_URL;
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport =  require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const multer = require("multer");


const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "/public/uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

main().then((res)=>{
 console.log("connected to Db");
}).catch((err)=>{
  console.log(err);
})

async function main(){
 await mongoose.connect(DB_URL);
}

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
// Parse JSON bodies (if needed for APIs)
app.use(express.json());
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const sessionOptions = {
  store: MongoStore.create({
    mongoUrl: DB_URL,
    touchAfter: 24 * 3600,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/",userRouter);

app.use((req,res,next)=>{
  next(new ExpressError(404,"Page Not Found"));
});

app.use((err,req,res,next)=>{
  let {statusCode=500, message="something went wrong"} = err;
  res.status(statusCode).render("error.ejs",{message});
}); 

const PORT = process.env.PORT || 3006;
app.listen(PORT,()=>{
  console.log(`server is listening to port : ${PORT}`);
});