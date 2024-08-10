const cloudinary = require('cloudinary').v2;
// const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//       folder: 'wanderlust_DEV',
//       allowerdFormats: ["png", "jpg", "jpeg", "pdf"], // supports promises as well
//     },
// });
const storage = new cloudinary.v2.uploader.upload("/home/my_image.jpg", { upload_preset: "my_preset" }, (error, result) => {
    console.log(result, error);
});

module.exports = {
    cloudinary,
    storage,
};