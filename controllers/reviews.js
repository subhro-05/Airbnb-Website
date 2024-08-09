const Review = require("../models/review.js");
const Listing = require("../models/listing.js")



/********Review Route********/
//post route
module.exports.post = async(req,res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.reviewSchema);
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("New Review Saved");
    req.flash("success", "New Review Created..!")
    res.redirect(`/listings/${listing._id}`);
}


//Delete Route
module.exports.delete = async(req,res) => {
    let {id, ReviewId} = req.params;
    console.log(id);
    console.log(ReviewId);
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: ReviewId}});
    await Review.findByIdAndDelete(ReviewId);
    req.flash("success", "Review Deleted..!")
    res.redirect(`/listings/${id}`);
}
