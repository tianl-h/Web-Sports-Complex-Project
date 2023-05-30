const programsRouter = require("express").Router();
const programsController = require("../controllers/programsController");

// Define routes for programs
programsRouter.get("/", programsController.getAll);
// GET request to display a form for creating a new program
programsRouter.get("/create", programsController.auth, (req, res) =>
    res.render("programs/new")
);
// POST request to create a new program
programsRouter.post(
    "/create",
    programsController.auth,
    programsController.validateProgram,
    programsController.addProgram
);
// GET request to display a form for editing an existing program
programsRouter.get(
    "/edit/:id",
    programsController.auth,
    programsController.editProgram
);
// POST request to update an existing program
programsRouter.post(
    "/edit/:id",
    programsController.auth,
    programsController.validateProgram,
    programsController.updateProgram
);
// DELETE request to delete an existing program
programsRouter.delete(
    "/:id",
    programsController.auth,
    programsController.deleteProgram
);
// GET request to display the details of a specific program
programsRouter.get("/show/:id", programsController.showProgram);

module.exports = programsRouter;
