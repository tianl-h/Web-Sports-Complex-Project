// Require the Facility and User models and the multer library for file uploads
const Facility = require("../models/facilities");
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

// Helper function to extract facility parameters from request body
const getFacilityParams = (body) => {
  return {
    name: body.name,
    type: body.type,
    description: body.description,
    images: body.images
  };
};

// Array of validation functions for the create and update actions.
const validate = (req, res, next) => {
  req.check("name").notEmpty().withMessage("name cannot be empty");
  req.check("description").notEmpty().withMessage("Description cannot be empty");

// check for validation errors and redirect if present
const errors = req.validationErrors();
  if (errors) {
    let messages = errors.map((e) => e.msg);
    req.flash("error", messages.join(" and "));
    res.redirect("/facilities/new");
  } else {
    next();
  }
};

// Define an object with several methods to handle facilities
module.exports = {
  index: async (req, res, next) => {
    try {
      const facilities = await Facility.find({});
      const user = req.user;
      res.render('facilities', { facilities, user });
    } catch (error) {
      console.log(`Error fetching facilities: ${error.message}`);
      req.flash('error', 'Error fetching facilities. Please try again later.');
      res.redirect('/');
    }
  },  
  
  // Render facilities index view
  indexView: (req, res) => {
    res.render("facilities/index");
  },

  // Render new facility form
  new: (req, res) => {
    res.render("facilities/new");
  },

  // Create a new facility
  create: [
    upload.array("images"),
    validate,
    async (req, res, next) => {
      const errors = req.validationErrors();
      try {
        if (errors) {
          const errorMessages = errors.array().map(error => error.msg);
          req.flash("error", errorMessages);
          res.redirect("/facilities/new");
        } else {
          const facilityParams = getFacilityParams(req.body);
            // Add image paths to the facilityParams
          if (req.files) {
            facilityParams.images = req.files.map((file) => `/uploads/${file.filename}`);
          }
          const newFacility = new Facility(facilityParams);
          const facility = await newFacility.save();
          if (facility) {
            req.flash("success", "Facility created successfully!");
            res.redirect("/facilities");
          } else {
            req.flash("error", "Failed to create facility.");
            res.redirect("/facilities/new");
          }
        }
      } catch (error) {
        console.log(`Error creating facility: ${error.message}`);
        next(error);
      }
    }
  ],

  // Render facility details
  show: async (req, res, next) => {
    try {
      const facilityId = req.params.id;
      const facility = await Facility.findById(facilityId);
      const facilities = await Facility.find({});
      const user = req.user;

      if (facility) {
        res.render("facilities/show", { facility, facilities, user });
      } else {
        res.locals.redirect = "/facilities";
        next();
      }
    } catch (error) {
      console.log(`Error fetching facility by ID: ${error.message}`);
      next(error);
    }
  },

  // Render facility edit form
  edit: async (req, res, next) => {
    try {
      const facilityId = req.params.id;
      const facility = await Facility.findById(facilityId);
      if (facility) {
        res.render("facilities/edit", { facility });
      } else {
        res.locals.redirect = "/facilities";
        next();
      }
    } catch (error) {
      console.log(`Error fetching facility by ID for edit: ${error.message}`);
      next(error);
    }
  },

  // Update a facility
  update: [
    upload.array("images"), 
    validate,
    async (req, res, next) => {
      const errors = req.validationErrors();
      try {
        const facilityId = req.params.id;
        const facilityParams = getFacilityParams(req.body);
        // Add image paths to the facilityParams
        if (req.files) {
          facilityParams.images = req.files.map((file) => `/uploads/${file.filename}`);
        }
        if (!errors) {
          await Facility.findByIdAndUpdate(facilityId, { $set: facilityParams });
          req.flash("success", "Facility updated successfully!");
          res.redirect(`/facilities/${facilityId}`);
        } else {
          const errorMessages = errors.array().map(error => error.msg);
          req.flash("error", errorMessages);
          res.redirect(`/facilities/${facilityId}/edit`);
        }
      } catch (error) {
        console.log(`Error updating facility by ID: ${error.message}`);
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

// Delete a facility
  delete: async (req, res, next) => {
    try {
      const facilityId = req.params.id;
      await Facility.findByIdAndRemove(facilityId);
      req.flash("success", "Facility deleted successfully!");
      res.locals.redirect = "/facilities";
      next();
    } catch (error) {
      console.log(`Error deleting facility by ID: ${error.message}`);
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
        res.redirect("/facilities");
      }
    } else {
      req.flash("error", "You must be logged in to access this page.");
      res.redirect("/users/login");
    }
  },
};

