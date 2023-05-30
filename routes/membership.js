const express = require('express');
const router = express.Router();
const membershipController = require('../controllers/membershipController');
const thanksController = require('../controllers/thanksController');


// Middleware to check if a user is logged in
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('error', 'You must be logged in to access this page.');
    res.redirect('/users/login');
  }
};

// Render all memberships
router.get('/', membershipController.index);


// Render new membership form
router.get('/new', isLoggedIn, membershipController.auth, membershipController.new);

// Create a new membership
router.post('/', isLoggedIn, membershipController.auth, membershipController.create);

// Render membership edit form
router.get('/:id/edit', isLoggedIn, membershipController.auth, membershipController.edit);

// Update a membership
router.put('/:id/update', isLoggedIn, membershipController.auth, membershipController.update, membershipController.redirectView);

// Show a membership
//router.get("/memberships/:id", membershipController.show);

// Delete a membership
router.delete('/:id', isLoggedIn, membershipController.auth, membershipController.delete, membershipController.redirectView);

// Buy a membership
router.post('/:id/buy', isLoggedIn, membershipController.buy);


// router.post("/signup", thanksController.index);

module.exports = router;

