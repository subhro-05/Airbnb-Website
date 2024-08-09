const Listing = require("../models/listing.js")

/********Index Route********/
module.exports.index = async(req,res) => {
    const allListings = await Listing.find({})
    res.render("listings/index.ejs",{allListings});
};

/********New Route********/
module.exports.new = (req,res) => {
    res.render("listings/new.ejs");
};

//Create Route
module.exports.create = async(req,res,next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url, "..", filename);
    const newListing = new Listing(req.body.listings);
    newListing.owner = req.user._id;
    newListing.image = {filename, url};
    await newListing.save();
    req.flash("success", "New Listings Created..!")
    res.redirect("/listings");
}

/********Show Route********/
module.exports.show = async(req,res,next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews", populate: {path:"author"},}).populate("owner");
    if(! listing){
        req.flash("error", "Listings you requested for dose not exist..!");
        res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs", {listing});
};

/********Edit Route********/
module.exports.edit = async (req,res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listings you requested for dose not exist..!");
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl.replace("/upload", "/upload/h_300,w_250");

    res.render("listings/edit.ejs",{listing, originalImageUrl});
};

//Update Route
module.exports.update = async(req,res,next) => {
    let { id } = req.params;
    // let listing = await Listing.findById(id);
    // if(!listing.owner._id.equals(res.locals.currUser._id)){
    //     req.flash("error", "You don't have permission to edit" );
    //     return res.redirect(`/listings/${id}`);
    // }
    let valListing = await Listing.findByIdAndUpdate(id, { ...req.body.listings});
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        valListing.image = {filename, url};
        await valListing.save();
    }
    req.flash("success", "Listings Updated..!")
    res.redirect(`/listings/${id}`);
};


/********Delete Route********/
module.exports.delete = async(req,res) => {
    let { id } = req.params;
    // console.log(id);
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listings Deleted..!")
    res.redirect("/listings");
}