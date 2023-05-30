// Require the Mongoose library to interact with MongoDB
const mongoose = require('mongoose');

// Define the schema for the Event model
const eventSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: {type:String, require:true},
  date: {type:Date, required:true},
  time: { type: String, required: false },
  location: {type:String, required:true},
  images: [{ type: String }]
});

// Export the Event model created from the schema
module.exports = mongoose.model("Event", eventSchema);


