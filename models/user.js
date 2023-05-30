// Require the Mongoose library to interact with MongoDB
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const passportLocalMongoose = require("passport-local-mongoose");
const { Schema } = mongoose;

// Define the user schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    memberships: [{ type: Schema.Types.ObjectId, ref: "Membership" }],
    isAdmin: { type: Boolean, default: false },
});

// Before inserting, ensure email is unique
userSchema.plugin(uniqueValidator);
userSchema.plugin(passportLocalMongoose, {
    usernameField: "email",
});

// Export the user model created from the schema
module.exports = mongoose.model("User", userSchema);
