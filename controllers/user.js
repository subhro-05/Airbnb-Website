const User = require("../models/user.js");


/* SIGN UP ROUTER */
module.exports.SignUp = (req,res) => {
    res.render("users/signup.ejs");
};

module.exports.sign_up = async(req,res) => {
    try{
        let {username , email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, ((err) => {
            if(err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust..!!");
            res.redirect("/listings");
        }))
    }catch(e){
        req.flash("error", e.error);
        res.redirect("/signup");
    }
};


/* LOG IN ROUTER */
module.exports.LogIn = (req,res) => {
    res.render("users/login.ejs");
};

module.exports.log_in = async(req,res) => {
    req.flash("success", "Welcome to Wanderlust...! You are logged in");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

/* LOG OUT ROUTER */
module.exports.Logout = (req,res,next) => {
    req.logout((err) => {
        if(err) {
            next();
        }
        req.flash("success", "You are Logged out");
        res.redirect("/listings");
    });
};