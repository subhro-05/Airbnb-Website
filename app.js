if(process.env.NODE_ENV != "production") {
    require('dotenv').config()  // use dotenv librery
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const passportLocal = require("passport-local");
const User = require("./models/user.js");

// const Listing = require("./models/listing.js")
// const Review = require("./models/review.js")
// const wrapAsync = require("./utils/wrapAsync.js");
// const {listingSchema, reviewSchema } = require("./schema.js");
// const {reviewSchema} = require("./schema.js");


const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");
// const cookieParser = require("cookie-parser");


const mongodb_Url = "mongodb://127.0.0.1:27017/wanderlust";
// const dbUrl = process.env.ATLASDB;
async function main(){
    await mongoose.connect(mongodb_Url);
};
main().then((res) => {
    console.log("Connected to DB");
}).catch((err) => {
    console.log(err);
});

app.engine("ejs", ejsMate);
app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));


//session part
const store = MongoStore.create({
    mongoUrl: mongodb_Url,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});
store.on("error", () => {
    console.log("Error in Mongo session store  !!", err);
})

const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true
    }
};
// app.get("/", (req,res) => {
//     res.send("Server is working");
// })


app.use(session(sessionOption));  //session use as a middleware
app.use(flash()); // flash part

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate())) // use static authenticate method of model in LocalStrategy

/*  use static serialize and deserialize of model for passport session support */
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

/* demo user */
// app.get("/demouser", async (req,res) => {
//     let fakeUser = new User({
//         email: "abc@gmail.com",
//         username: "delta",
//     });
//     let registeredUser = await User.register(fakeUser,"HelloWorld");
//     res.send(registeredUser);
// });

app.use("/listings", listingRouter);  //use express router
app.use("/listings/:id/reviews", reviewRouter) //use express router
app.use("/", userRouter);   //use user Router

// const validateListing = (req,res,next) => {
//     let {error} = listingSchema.validate(req.body);
//     if(error){
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400, errMsg);
//     }else{
//         next();
//     }
// };

// const validateReview = (req,res,next) => {
//     let {error} = reviewSchema.validate(req.body);
//     if(error){
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400, errMsg);
//     }else{
//         next();
//     }
// };

// /********Index Route********/
// app.get("/listings", wrapAsync(async(req,res) => {
//     const allListings = await Listing.find({})
//     res.render("listings/index.ejs",{allListings});
// }));

// /********New Route********/
// app.get("/listings/new", (req,res) => {
//     res.render("listings/new.ejs");
// })
// //Create Route
// app.post("/listings", wrapAsync(async(req,res,next) => {
    
//     const newListing = new Listing(req.body.listings);
//     await newListing.save();
//     res.redirect("/listings");
// }));

// /********Show Route********/
// app.get("/listings/:id", wrapAsync(async(req,res,next) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id).populate("reviews");
//     res.render("listings/show.ejs", {listing});
// }));

// /********Edit Route********/
// app.get("/listings/:id/edit", wrapAsync(async (req,res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id);
//     res.render("listings/edit.ejs",{listing});
// }));
// //Update Route
// app.put("/listings/:id", wrapAsync(async(req,res,next) => {
//     let { id } = req.params;
//     await Listing.findByIdAndUpdate(id, { ...req.body.listings});
//     res.redirect(`/listings/${id}`);
// }))

// /********Delete Route********/
// app.delete("/listings/:id", wrapAsync(async(req,res,next) => {
//     let { id } = req.params;
//     const deletedListing = await Listing.findByIdAndDelete(id);
//     console.log(deletedListing);
//     res.redirect("/listings");
// }))

// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India",
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });

// /********Review Route********/
// //post route
// app.post("/listings/:id/reviews", wrapAsync(async(req,res) => {
//     let listing = await Listing.findById(req.params.id);
//     let newReview = new Review(req.body.reviewSchema);
//     listing.reviews.push(newReview);
//     await newReview.save();
//     await listing.save();
//     console.log("New Review Saved");
//     res.redirect(`/listings/${listing._id}`);
// }));

// //Delete Route
// app.delete("/listings/:id/reviews/:ReviewId", wrapAsync(async(req,res) => {
//     let {id, ReviewId} = req.params;
//     await Listing.findByIdAndUpdate(id, {$pull: {reviews: ReviewId}});
//     await Review.findByIdAndDelete(ReviewId);
//     res.redirect(`/listings/${id}`);
// }))


app.all("*", (req,res,next) => {
    next(new ExpressError(404,"Page Not Found"));
})

app.use((err,req,res,next) => {
    let {statusCode=500, massage="Something Want Wrong"} = err;
    res.render("error.ejs",{statusCode,massage});
    //res.status(statusCode).send(massage);
})

app.listen("8080", () => {
    console.log("Server is listening to port 8080");
})

