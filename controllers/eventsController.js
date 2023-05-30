// Require the Event and User models and the multer library for file uploads
const Event = require("../models/events");
const User = require("../models/user");
const multer = require("multer"); 

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });
// Helper function to extract event parameters from request body
const getEventParams = (body) => {
  return {
    name: body.name,
    description: body.description,
    date: body.date,
    time: body.time,
    location: body.location,
    images: body.images
  };
};

// Array of validation functions for the create and update actions.
const validate = (req, res, next) => {
  req.check("name").notEmpty().withMessage("name cannot be empty");
  req.check("description").notEmpty().withMessage("Description cannot be empty");
  req.check("date").notEmpty().withMessage("Date cannot be empty").isISO8601().withMessage("Invalid date format");
  req.check("location").notEmpty().withMessage("Location cannot be empty");

const errors = req.validationErrors();
  if (errors) {
    let messages = errors.map((e) => e.msg);
    req.flash("error", messages.join(" and "));
    res.redirect("/events/new");
  } else {
    next();
  }
};

// Define an object with several methods to handle events
module.exports = {
  index: async (req, res, next) => {
    try {
      const events = await Event.find({});
      const user = req.user;
      res.render('events', { events, user });
    } catch (error) {
      console.log(`Error fetching events: ${error.message}`);
      req.flash('error', 'Error fetching events. Please try again later.');
      res.redirect('/');
    }
  },  
  
  // Render event index view
  indexView: (req, res) => {
    res.render("events/index");
  },

  // Render new event form
  new: (req, res) => {
    res.render("events/new");
  },

   // Create a new event
  create: [
    upload.array("images"),
    validate,
    async (req, res, next) => {
      const errors = req.validationErrors();
      try {
        if (errors) {
          const errorMessages = errors.array().map(error => error.msg);
          req.flash("error", errorMessages);
          res.redirect("/events/new");
        } else {
          const eventParams = getEventParams(req.body);
          if (req.files) {
            eventParams.images = req.files.map((file) => `/uploads/${file.filename}`);
          }
          const newEvent = new Event(eventParams);
          const event = await newEvent.save();
          if (event) {
            req.flash("success", "Event created successfully!");
            res.redirect("/events");
          } else {
            req.flash("error", "Failed to create event.");
            res.redirect("/events/new");
          }
        }
      } catch (error) {
        console.log(`Error creating event: ${error.message}`);
        next(error);
      }
    }
  ],

  // Render event details
  show: async (req, res, next) => {
    try {
      const eventId = req.params.id;
      const event = await Event.findById(eventId);
      const events = await Event.find({});
      const user = req.user;

      if (event) {
        res.render("events/show", { event, events, user });
      } else {
        res.locals.redirect = "/events";
        next();
      }
    } catch (error) {
      console.log(`Error fetching event by ID: ${error.message}`);
      next(error);
    }
  },

    // Render event edit form
  edit: async (req, res, next) => {
    try {
      const eventId = req.params.id;
      const event = await Event.findById(eventId);
      if (event) {
        res.render("events/edit", {event});
      } else {
        res.locals.redirect = "/events";
        next();
      }
    } catch (error) {
      console.log(`Error fetching event by ID for edit: ${error.message}`);
      next(error);
    }
  },

    // Update a event
  update: [
    upload.array("images"), 
    validate,
    async (req, res, next) => {
      const errors = req.validationErrors();
      try {
        const eventId = req.params.id;
        const eventParams = getEventParams(req.body);
        if (req.files) {
          eventParams.images = req.files.map((file) => `/uploads/${file.filename}`);
        }
        if (!errors) {
          await Event.findByIdAndUpdate(eventId, { $set: eventParams });
          req.flash("success", "event updated successfully!");
          res.redirect(`/events/${eventId}`);
        } else {
          const errorMessages = errors.array().map(error => error.msg);
          req.flash("error", errorMessages);
          res.redirect(`/events/${eventId}/edit`);
        }
      } catch (error) {
        console.log(`Error updating event by ID: ${error.message}`);
        next(error);
      }
    }
  ],

  // Middleware function that checks if a redirect path is set
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },

// Delete a event
  delete: async (req, res, next) => {
    try {
      const eventId = req.params.id;
      await Event.findByIdAndRemove(eventId);
      req.flash("success", "event deleted successfully!");
      res.locals.redirect = "/events";
      next();
    } catch (error) {
      console.log(`Error deleting event by ID: ${error.message}`);
      next(error);
    }
  },

   // Middleware function to check if the user is authenticated and an admin
  auth: (req, res, next) => {
    // Use Passport's isAuthenticated method to check if user is authenticated
    if (req.isAuthenticated()) {
      // Check if user is an admin
      if (req.user.isAdmin) {
        return next();
      } else {
        req.flash("error", "You must be an admin to access this page.");
        res.redirect("/events");
      }
    } else {
      req.flash("error", "You must be logged in to access this page.");
      res.redirect("/users/login");
    }
  },
};


