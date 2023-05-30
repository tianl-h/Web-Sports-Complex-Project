// Require the User model and passport package
const User = require("../models/user");
const passport = require("passport");

// isAdmin middleware
const isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.isAdmin) {
        next();
    } else {
        //   req.flash("error", "Access denied. You must be an admin to view this page.");
        res.redirect("/");
    }
};

// Function to get user parameters from the request body
const getUserParams = (body) => {
    let userParams = {
        name: body.name,
        email: body.email,
        password: body.password,
        membership: body.membership,
    };
    // If zip code is present and not empty, add it to the user parameters
    if (body.zipCode && body.zipCode.trim() !== "") {
        userParams.zipCode = body.zipCode;
    }
    return userParams;
};

// Exporting all controller functions as an object
module.exports = {
    // Validate required user fields
    validateUser: (req, res, next) => {
        req.check("name").notEmpty().withMessage("Name is required");
        req.check("email")
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Email is invalid");
        req.check("password").notEmpty().withMessage("Password is required");

        req.getValidationResult().then((errors) => {
            if (!errors.isEmpty()) {
                let messages = errors.array().map((e) => e.msg);
                req.flash("error", messages.join(" and "));
                res.redirect("create");
            } else {
                next();
            }
        });
    },

    // Middleware for rendering the user index page
    index: (req, res, next) => {
        if (req.isAuthenticated()) {
            if (req.user.isAdmin) {
                console.log("User is an admin");
                User.find({})
                    .then((users) => {
                        res.locals.users = users;
                        next();
                    })
                    .catch((error) => {
                        console.log(`Error fetching users: ${error.message}`);
                        next(error);
                    });
            } else {
                console.log("User is not an admin");
                User.findById(req.user._id)
                    .then((user) => {
                        res.locals.users = [user];
                        next();
                    })
                    .catch((error) => {
                        console.log(`Error fetching user: ${error.message}`);
                        next(error);
                    });
            }
        } else {
            console.log("User is not authenticated");
            res.redirect("/users/login");
        }
    },

    // Middleware for rendering the user index view
    indexView: (req, res) => {
        console.log("Rendering users/index with users:", res.locals.users);
        res.render("users/index", { users: res.locals.users });
    },

    // Middleware for creating a new user
    create: async (req, res, next) => {
        let newUser = new User(getUserParams(req.body));
        try {
            newUser.setPassword(req.body.password, async (err) => {
                if (err) {
                    req.flash(
                        "error",
                        `Failed to create user account because: ${err.message}.`
                    );
                    res.locals.redirect = "/users/new";
                    return next(err);
                } else {
                    const user = await newUser.save();
                    req.flash(
                        "success",
                        `${user.name}'s account created successfully!`
                    );

                    // req.login(user, (err) => {
                    //   if (err) {
                    //     req.flash("error", `Login after registration failed: ${err.message}`);
                    //     res.locals.redirect = "/users/login";
                    //     return next(err);
                    //   }

                    //   res.locals.redirect = `/users/${user._id}`;
                    //   // res.locals.redirect = "/users";
                    //   return next();
                    // });
                    // Redirect to the login page
                    res.locals.redirect = "/";
                    return next();
                }
            });
        } catch (error) {
            req.flash(
                "error",
                `Failed to create user account because: ${error.message}.`
            );
            res.locals.redirect = "/users/new";
            return next(error);
        }
    },

    // Delete a user
    deleteUser: (req, res, next) => {
        if (
            req.isAuthenticated() &&
            (req.user._id.toString() === req.params.id ||
                req.user.role === "admin")
        ) {
            let userId = req.params.id;
            User.findByIdAndRemove(userId)
                .then(() => {
                    req.flash("success", "User successfully deleted");
                    res.locals.redirect = "/users";
                    next();
                })
                .catch((error) => {
                    console.log(`Error deleting user by ID: ${error.message}`);
                    req.flash("error", "Fail to delete user");
                    res.locals.redirect = "/users";
                    next();
                });
        } else {
            req.flash(
                "error",
                "You can only delete your own account or must be an admin."
            );
            res.redirect("/users");
        }
    },

    // Renders the user edit view with the requested user's details
    editUser: async (req, res, next) => {
        if (
            req.isAuthenticated() &&
            (req.user._id.toString() === req.params.id || req.user.isAdmin)
        ) {
            let userId = req.params.id;
            try {
                const user = await User.findById(userId);
                // Retrieve error messages from flash and assign them to a variable
                const errors = req.flash("error");
                // Render the 'users/edit' view with the user data and error messages
                res.render("users/edit", {
                    user: user,
                    errors: errors,
                });
            } catch (error) {
                console.log(`Error fetching user by ID: ${error.message}`);
                next(error);
            }
        } else {
            req.flash(
                "error",
                "You can only update your own account or must be an admin."
            );
            res.redirect("/users");
        }
    },

    // Update a user
    updateUser: [
        async (req, res, next) => {
            if (
                req.isAuthenticated() &&
                (req.user._id.toString() === req.params.id || req.user.isAdmin)
            ) {
                let userId = req.params.id;
                try {
                    const user = await User.findById(userId);
                    user.setPassword(req.body.password, async (err) => {
                        if (err) {
                            console.log(
                                `Error updating user password: ${err.message}`
                            );
                            next(err);
                        } else {
                            let userParams = getUserParams(req.body);
                            const updatedUser = Object.assign(user, userParams);
                            try {
                                const savedUser = await updatedUser.save();
                                // console.log("New password set:", req.body.password);
                                req.flash(
                                    "success",
                                    "User account updated successfully!"
                                );
                                res.locals.redirect = `/users/${userId}`;
                                res.locals.user = savedUser;
                                next();
                            } catch (err) {
                                console.log(
                                    `Error saving updated user: ${err.message}`
                                );
                                next(err);
                            }
                        }
                    });
                } catch (error) {
                    console.log(`Error updating user by ID: ${error.message}`);
                    next(error);
                }
            } else {
                req.flash(
                    "error",
                    "You can only update your own account or must be an admin."
                );
                res.redirect("/users");
            }
        },
    ],

    // Renders the user show view with the requested user's details
    showUser: async (req, res, next) => {
        let userId = req.params.id;
        if (userId === "create") {
            res.render("users/new");
            return;
        }
        try {
            if (userId === "logout") {
                res.render("users/logout");
                return;
            }
            const user = await User.findById(userId)
            .populate('memberships')
            res.locals.user = user;
            //   console.log('req.user:', req.user);
            res.render("users/show", { currentUser: user });
        } catch (error) {
            console.log(`Error fetching user by ID: ${error.message}`);
            next(error);
        }
    },

    // renders the user registration view.
    new: (req, res) => {
        res.render("users/new");
    },

    // Renders the user login view
    login: (req, res, next) => {
        try {
            const flashMessages = req.flash(); // get the flash messages
            // console.log(flashMessages);
            // console.log("reqsession:", req.session);
            const error = req.query.error;
            const loggedIn = req.isAuthenticated();
            const user = req.user;
            console.log("logged user:", user);
            if (error === "account-required") {
                flashMessages.error = "An account is required to log in.";
            } else if (error === "user-not-found") {
                flashMessages.error =
                    "An account is required to log in. Please sign up first.";
            }
            res.render("users/login", { flashMessages, loggedIn, user });
        } catch (error) {
            console.log(`Error rendering login view: ${error.message}`);
            next(error);
        }
    },

    // Renders the user logout view
    logout: (req, res, next) => {
        if (req.isAuthenticated()) {
            req.logout((err) => {
                if (err) {
                    return next(err);
                }
                console.log("Logout successful");
                req.flash("success", "You have been logged out!");
                // res.redirect("/users/login");
                res.locals.redirect = "/";
                next();
            });
        } else {
            console.log("User not authenticated");
            req.flash("error", "You are not logged in.");
            res.redirect("/users/login");
        }
    },

    // redirecting the user to the appropriate page after an action has been performed
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        // console.log('Redirect path:', redirectPath);
        if (redirectPath) {
            if (redirectPath === "/users") {
                // Redirect to the index view if the redirect path is /users
                return res.redirect(redirectPath);
            } else {
                res.redirect(redirectPath);
            }
        } else {
            next();
        }
    },

    // Authentication middleware
    authenticate: (req, res, next) => {
        passport.authenticate("local", (err, user, info) => {
            if (err) {
                req.flash(
                    "error",
                    "An error occurred while authenticating. Please try again."
                );
                return next(err);
            }
            if (!user) {
                const errorType =
                    info && info.message === "Missing credentials"
                        ? "account-required"
                        : "user-not-found";
                req.flash(
                    "error",
                    "Authentication failed. Please check your credentials and try again."
                );
                return res.redirect(`/users/login?error=${errorType}`);
            }
            req.logIn(user, (err) => {
                if (err) {
                    req.flash(
                        "error",
                        "An error occurred while logging in. Please try again."
                    );
                    return next(err);
                }
                req.flash("success", "User logged in successfully!");
                return res.redirect("/users/" + user._id);
            });
        })(req, res, next);
    },
};
