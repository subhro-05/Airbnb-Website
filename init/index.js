const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const mongoUrl = "mongodb://127.0.0.1:27017/wanderlust"
async function main(){
    await mongoose.connect(mongoUrl);
};
main().then((res) => {
    console.log("Connected to DB");
}).catch((err) => {
    console.log(err);
});

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({...obj, owner: "6622126a29a2546a97aa5beb"}));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();