const router = require("express").Router();
const usersRouter = require("./user");
const homeRouter = require("./home");
const programsRouter = require("./program");
const facilitiesRoutes = require("./facilities");
const membershipRoutes = require("./membership");
const eventsRoutes = require("./events");
const contactRouter = require("./contact");
const aboutRouter = require("./about")

// Use routers for different parts of application
router.use("/", homeRouter);
router.use("/users", usersRouter);
router.use("/programs", programsRouter);
router.use("/facilities", facilitiesRoutes);
router.use("/events", eventsRoutes);
router.use("/memberships", membershipRoutes);
router.use("/contact", contactRouter);
router.use("/about", aboutRouter);
// router.use("/", errorRouter);

module.exports = router;
