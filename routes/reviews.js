const express = require("express");
const router = express.Router({ mergeParams : true});
const Listing = require("../models/listing.js")
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
// const { reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/expressError.js");
const { isLoggedIn, isAuthor } = require("../middleware.js");
const reviewContriller = require("../controllers/reviews.js");

/********Review Route********/
//post route
router.post("/", isLoggedIn, wrapAsync(reviewContriller.post));

//Delete Route
router.delete("/:ReviewId", isLoggedIn, isAuthor, wrapAsync(reviewContriller.delete))



module.exports = router;