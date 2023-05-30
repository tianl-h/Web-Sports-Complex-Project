// Import necessary modules
const express = require("express");
const app = express();
const layouts = require("express-ejs-layouts");
const LocalStrategy = require("passport-local").Strategy;
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const methodOverride = require("method-override");
const passport = require("passport");
const User = require("./models/user");
const router = require("./routes/index");
const thanksController = require("./controllers/thanksController");
const membershipController = require("./controllers/membershipController");

// Initialize facilities and events data
const initializeFacilities = require("./initializeFacilities");
const initializeEvents = require("./initializeEvents");
const initializeMemberships = require("./initializeMembership");
const initializaPrograms = require("./initializePrograms");
initializeFacilities();
initializeEvents();
initializeMemberships();
initializaPrograms();

// connect to db
const mongoose = require("mongoose");
mongoose
    .connect("mongodb://127.0.0.1:27017/brandeis_sport")
    .then(() => {
        console.log("MongoDB connected...");
    })
    .catch((err) => {
        console.log("Error:", err.message);
    });

// Set up view engine and middleware
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(layouts);
app.use(methodOverride("_method", { methods: ["POST", "GET"] }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(flash());
app.use(expressValidator());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser("secret-pascode"));
app.use(
    session({
        secret: "secret_passcode",
        cookie: { maxAge: 400000 },
        resave: true,
        saveUninitialized: true,
    })
);

// set up passport
app.use(passport.initialize());
app.use(passport.session());

// Use passport for user authentication
passport.use(
    new LocalStrategy(
        { usernameField: "email" },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ email: email });
                if (!user) {
                    return done(null, false, {
                        message:
                            "Failed to log in user account: User account not found.",
                    });
                }
                user.authenticate(password, (err, result) => {
                    if (err) return done(err);
                    if (!result) {
                        return done(null, false, {
                            message:
                                "Failed to log in user account: Incorrect Password.",
                        });
                    }
                    return done(null, user);
                });
            } catch (err) {
                return done(err);
            }
        }
    )
);
passport.serializeUser((user, done) => {
    done(null, user._id);
});
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

// Create a middleware that is called on every request
app.use((req, res, next) => {
    res.locals.flashMessages = req.flash();
    res.locals.loggedIn = req.isAuthenticated();
    res.locals.currentUser = req.user;
    next();
});

// Render the membership page
app.get("/membership", membershipController.index);

// Use the router middleware for all routes
app.use("/", router);

// Create an admin user if one does not exist
async function createAdminUser() {
    try {
        const adminUserExists = await User.findOne({ isAdmin: true });

        if (!adminUserExists) {
            const adminUser = new User({
                email: "admin@example.com",
                name: "Admin",
                isAdmin: true,
            });

            await User.register(adminUser, "12345"); // 12345 is the default password
            console.log("Admin user created:", adminUser);
        }
    } catch (error) {
        console.error("Error creating admin user:", error);
    }
}

// Start the server and listen for requests
app.listen(3000, () => {
    console.log("Server listening on port 3000");
});

// Create the admin user
createAdminUser();
