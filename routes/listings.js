const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js")
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner} = require("../middleware.js");
const listingController = require("../controllers/listings.js");

const multer  = require('multer')
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, "uploads"); // Set the destination folder
//     },
//     filename: function (req, file, cb) {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E5)
//       cb(null, uniqueSuffix + "-" + file.originalname);
//     },
//   });
  
  // const upload = multer({ storage });

// const { index, new } = require("../controllers/listings.js");
// const {listingSchema } = require("../schema.js");
// const ExpressError = require("../utils/expressError.js");

/* Index and Create Route */
router
    .route("/")
    .get(wrapAsync(listingController.index)) //Index Route
    .post(isLoggedIn, upload.single("listings[image]"), wrapAsync(listingController.create)
    ); // Create Route

    
// /********Index Route********/
// router.get("/", wrapAsync(listingController.index));
    
/********New Route********/
router.get("/new", isLoggedIn, listingController.new);
    
// //Create Route
// router.post("/", isLoggedIn, wrapAsync(listingController.create));
    
// /********Show Route********/
// router.get("/:id", wrapAsync(listingController.show));
    
/********Edit Route********/
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.edit));

/* Show Route, Update Route, Delete Route */
router
    .route("/:id")
    .get(wrapAsync(listingController.show))  // Show Route
    .put(isLoggedIn, isOwner, upload.single("listings[image]"),wrapAsync(listingController.update)) // Update Route
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.delete)); // Delete Route

// //Update Route
// router.put("/:id", isLoggedIn, isOwner, wrapAsync(listingController.update))

// /********Delete Route********/
// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.delete))


module.exports = router;