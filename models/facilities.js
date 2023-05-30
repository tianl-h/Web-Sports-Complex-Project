// Require the Mongoose library to interact with MongoDB
const mongoose = require("mongoose");

// Define the schema for the Facility model
const facilitySchema = new mongoose.Schema({
  name: {type:String, required:true},
  type: {type:String, required:true},
  description: {type:String, required:true},
  images: [{ type: String }]
})

// Export the Facility model created from the schema
module.exports = mongoose.model("Facility", facilitySchema);

  