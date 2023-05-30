// Require the Mongoose library to interact with MongoDB
const mongoose = require('mongoose');

// Define the schema for the Membership model
const membershipSchema = mongoose.Schema({
  type: { type: String, required: true },
  duration: { type: Number, required: true },
  price: { type: Number, required: true },
});

// Export the Membership model created from the schema
const membership = mongoose.model('Membership', membershipSchema);
module.exports = membership;
