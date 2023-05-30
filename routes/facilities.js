// Require the express module and create a new router object and require controller
const express = require('express');
const router = express.Router();
const facilitiesController = require('../controllers/facilitiesController');

// Render all facilities
router.get('/', facilitiesController.index, facilitiesController.indexView);
// Render new facility form
router.get("/new", facilitiesController.auth, facilitiesController.new);
// Create a new facility
router.post("/create", facilitiesController.auth, facilitiesController.create, facilitiesController.redirectView);
// Show a facility
router.get("/:id", facilitiesController.show);
// Render facility edit form
router.get("/:id/edit", facilitiesController.auth, facilitiesController.edit);
// Update a facility
router.put("/:id/update", facilitiesController.auth, facilitiesController.update, facilitiesController.redirectView);
// Delete a facility
router.delete("/:id/delete", facilitiesController.auth, facilitiesController.delete, facilitiesController.redirectView);

module.exports = router;


