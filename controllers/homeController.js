// This module exports an object containing various controller functions for the Home route.
const Facility = require("../models/facilities");
const program = require("../models/program");
const Event = require("../models/events");
const Membership = require("../models/membership")

module.exports = {
    index: async (req, res) => {
        const user = req.user;
        try {
            const facilities = await Facility.find({});
            const programs = await program.find({});
            const events = await Event.find({});
            const memberships = await Membership.find({});
            res.render("home", { facilities, user, programs, events, memberships });
        } catch (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        }
    },
};
