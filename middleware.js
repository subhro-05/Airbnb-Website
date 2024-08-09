const Listing = require("./models/listing");
const Review = require("./models/review");

module.exports.isLoggedIn = (req,res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create listings");
        return res.redirect("/login")
    }
    next();
}

module.exports.saverdirectUrl = (req,res,next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}


module.exports.isOwner = async (req,res,next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this listings...!!" );
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isAuthor = async(req,res,next) => {
    let { id, ReviewId } = req.params;
    let review = await Review.findById(ReviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the author of this reviews...!!" );
        return res.redirect(`/listings/${id}`);
    }
    next();
}