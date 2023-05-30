// Require the Mongoose library to interact with MongoDB
const mongoose = require("mongoose");

// Define the program schema
const programSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    schedule: { type: String, required: true },
    instructor: { type: String, required: true },
});

// Export the Program model created from the schema
module.exports = mongoose.model("Program", programSchema);
