// Require the express module and create a new router object and require controller
const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');

// Render all events
router.get('/', eventsController.index, eventsController.indexView);
// Render new event form
router.get("/new", eventsController.auth, eventsController.new);
// Create a new event
router.post("/create", eventsController.auth, eventsController.create, eventsController.redirectView);
// Render an individual event
router.get("/:id", eventsController.show);
// Render the edit event form
router.get("/:id/edit", eventsController.auth, eventsController.edit);
// Update an event
router.put("/:id/update", eventsController.auth, eventsController.update, eventsController.redirectView);
// Delete an event
router.delete("/:id/delete", eventsController.auth, eventsController.delete, eventsController.redirectView);

module.exports = router;

