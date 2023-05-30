// Require the Membership and User models
const Membership = require("../models/membership");
const User = require("../models/user");


// Array of validation functions for the create and update actions
const validate = (req, res, next) => {
  req.check("type").notEmpty().withMessage("Type cannot be empty");
  req.check("duration").notEmpty().withMessage("Duration cannot be empty").isInt().withMessage("Duration must be a number");
  req.check("price").notEmpty().withMessage("Price cannot be empty").isFloat().withMessage("Price must be a number");

  const errors = req.validationErrors();
  if (errors) {
    let messages = errors.map((e) => e.msg);
    req.flash("error", messages.join(" and "));
    res.redirect("/memberships/new");
  } else {
    next();
  }
};


module.exports = {
  // Render all memberships
  index: async (req, res, next) => {
    try {
      const memberships = await Membership.find({});
      const user = req.user;
      res.render("memberships", { memberships, user });
    } catch (error) {
      console.log(`Error fetching memberships: ${error.message}`);
      req.flash("error", "Error fetching memberships. Please try again later.");
      res.redirect("/");
    }
  },

  // Render new membership form
  new: (req, res) => {
    res.render("memberships/new");
  },

  // Create a new membership
  create: async (req, res, next) => {
    try {
      const membershipParams = {
        type: req.body.type,
        duration: req.body.duration,
        price: req.body.price,
      };

      const newMembership = new Membership(membershipParams);
      const membership = await newMembership.save();

      if (membership) {
        req.flash("success", "Membership created successfully!");
        res.redirect("/memberships");
      } else {
        req.flash("error", "Failed to create membership.");
        res.redirect("/memberships/new");
      }
    } catch (error) {
      console.log(`Error creating membership: ${error.message}`);
      next(error);
    }
  },

  // Render membership edit form
  edit: async (req, res, next) => {
    try {
      const membershipId = req.params.id;
      const membership = await Membership.findById(membershipId);
      if (membership) {
        res.render("memberships/edit", { membership });
      } else {
        res.locals.redirect = "/memberships";
        next();
      }
    } catch (error) {
      console.log(`Error fetching membership by ID for edit: ${error.message}`);
      next(error);
    }
  },

  // Update a membership
  update: async (req, res, next) => {
    try {
      const membershipId = req.params.id;
      const membershipParams = {
        type: req.body.type,
        duration: req.body.duration,
        price: req.body.price,
      };

      await Membership.findByIdAndUpdate(membershipId, { $set: membershipParams });

      req.flash("success", "Membership updated successfully!");
      res.redirect(`/memberships`);
    } catch (error) {
      console.log(`Error updating membership by ID: ${error.message}`);
      next(error);
    }
  },

    // Middleware function that checks if a redirect path is set
    redirectView: (req, res, next) => {
      let redirectPath = res.locals.redirect;
      if (redirectPath) res.redirect(redirectPath);
      else next();
    },

      // Show a membership
    //show: (req, res) => {
      //const membershipId = req.params.id;
      //Membership.findOne({ _id: membershipId })
        //.then((membership) => {
          //res.render("memberships/show", { membership });
        //})
        //.catch(() => {
          //req.flash("error", "Error, please try again later");
          //res.redirect("/membership");
        //});
    //},

  
  // Delete a membership
  delete: async (req, res, next) => {
    try {
      const membershipId = req.params.id;
      await Membership.findByIdAndRemove(membershipId);
      req.flash("success", "Membership deleted successfully!");
      res.locals.redirect = "/memberships";
      next();
    } catch (error) {
      console.log(`Error deleting membership by ID: ${error.message}`);
      next(error);
    }
  },

  // Middleware function to check if user is authenticated and an admin
  auth: (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.isAdmin) {
        return next();
      } else {
        req.flash("error", "You must be an admin to access this page.");
        res.redirect("/memberships");
      }
    } else {
      req.flash("error", "You must be logged in to access this page.");
      res.redirect("/users/login");
    }
  },
  
  
 // Allow logged in user to buy a membership
  buy: async (req, res, next) => {
    try {
      if (req.isAuthenticated()) {
        const membershipId = req.params.id;
        const membership = await Membership.findById(membershipId);
        const user = await User.findById(req.user._id);

        if (membership && user) {
          user.memberships.push(membership);
          await user.save();

          req.flash("success", "Membership purchased successfully!");
          res.redirect("/memberships");
        } else {
          req.flash("error", "Error purchasing membership.");
          res.redirect("/memberships");
        }
      } else {
        req.flash("error", "You must be logged in to buy a membership.");
        res.redirect("/users/login");
      }
    } catch (error) {
      console.log(`Error buying membership: ${error.message}`);
      next(error);
    }
  }
}
