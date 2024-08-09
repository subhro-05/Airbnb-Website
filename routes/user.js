const express = require("express");
const router = express.Router({ mergeParams : true});
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saverdirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");


/* SIGN UP ROUTER */

router.route("/signup")
    .get(userController.SignUp)
    .post(wrapAsync(userController.sign_up));

// router.get("/signup", userController.SignUp);

// router.post("/signup", wrapAsync(userController.sign_up));


/* LOG IN ROUTER */

router.route("/login")
    .get(userController.LogIn)
    .post( saverdirectUrl, 
    passport.authenticate("local", { failureRedirect: "/login", failureFlash: true}), 
    userController.log_in);

    
// router.get("/login", userController.LogIn);
// router.post("/login", 
//     saverdirectUrl, 
//     passport.authenticate("local", { failureRedirect: "/login", failureFlash: true}), 
//     userController.log_in);

/* LOG OUT ROUTER */
router.get("/logout", userController.Logout);


module.exports = router;