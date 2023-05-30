// Require the Program models
const Program = require("../models/program");
var staticContent;

module.exports = {
    // Validate required program fields
    validateProgram: (req, res, next) => {
        req.check("name").notEmpty().withMessage("Name is required");
        req.check("description")
            .notEmpty()
            .withMessage("Description is required");
        req.check("schedule").notEmpty().withMessage("Schedule is required");
        req.check("instructor")
            .notEmpty()
            .withMessage("Instructor is required");

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

    // Add the program to the database
    addProgram: (req, res) => {
        const newProgram = new Program(req.body);
        newProgram
            .save()
            .then((savedProgram) => {
                req.flash("success", `${savedProgram.name} created`);
                res.redirect("./");
            })
            .catch(() => {
                req.flash("error", "Fail to add Program");
                res.redirect("create");
            });
    },

    // Get all programs from the database and retrieve needed information
    getAll: (req, res) => {
        const user = req.user;
        Program.find({}, "name description schedule instructor")
            .then((programs) => {
                res.render(
                    "programs/index",
                    Object.assign({}, staticContent, { programs, user })
                );
            })
            .catch((err) => {
                req.flash("error", "Fail to list programs");
                res.redirect("./");
            });
    },

    // Delete a program
    deleteProgram: (req, res) => {
        Program.deleteOne({ _id: req.params.id })
            .then(() => {
                req.flash("success", "Program successfully deleted");
                res.redirect(".");
            })
            .catch(() => {
                req.flash("error", "Fail to delete program");
                res.redirect("./");
            });
    },

    // Edit a program
    editProgram: (req, res) => {
        Program.findOne({ _id: req.params.id })
            .then((program) => {
                res.render("programs/edit", { program });
            })
            .catch(() => {
                req.flash("error", "Fail to edit program");
                res.redirect("./");
            });
    },

    // Update a program
    updateProgram: (req, res) => {
        const programId = req.params.id;
        Program.findByIdAndUpdate(programId, {
            $set: req.body,
        })
            .then(() => {
                req.flash("success", "Program successfully updated");
                res.redirect("/programs");
            })
            .catch(() => {
                req.flash("error", "Fail to update program");
                res.redirect("./" + programId);
            });
    },

    // Show a program
    showProgram: (req, res) => {
        const programId = req.params.id;
        const user = req.user;
        Program.findOne({ _id: programId })
            .then((program) => {
                res.render("programs/show", { program, user });
            })
            .catch(() => {
                req.flash("error", "Error, please try again later");
                res.redirect("/programs");
            });
    },

    // verify whether the user is logged in and is admin
    auth: (req, res, next) => {
        if (req.isAuthenticated()) {
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

// static content for program page
staticContent = {
    fitnessClasses: [
        {
            class: "Adult Learn to Swim",
            description:
                "3 week course (please plan to attend all 3 dates, March 8, 15 and 22, 11-11:45am Open to Graduate Students and Staff/Faculty to learn the basics of swimming and water safety. Email kpage@brandeis.edu to register.",
        },
        {
            class: "Cycle",
            description:
                "Come join our Brandeis cycle community! Feed off the incredible energy in the room with a combination or endurance and strength building intervals. With a mix of fast sprints and heavy climbs, all timed to the beat of the music, you'll be counting down the hours till you're back on the saddle once again.",
        },
        {
            class: "Cycle n Core",
            description:
                "20 minutes on the bike to get that heart rate up and then 20 minutes to chisel and tone your core!",
        },
        {
            class: "Faculty/Staff Yoga (F/S Yoga)",
            description:
                "45 minute session to reset, refresh and recharge! Offered up in Skyline so faculty/staff can easily access the space and minimize time away from the office!",
        },
        {
            class: "Krava Maga",
            description:
                "Join Miriam in this hour long class that focuses on dynamic self defense movements. Effective, modern and used by the Israeli Defense Forces",
        },
        {
            class: "Pilates",
            description:
                "Hour long class to promote body awareness using small muscle movements. Helps improve flexibility and strength.",
        },
        {
            class: "TRX",
            description:
                "Great way to start you day!! Using just your body weight, join Coach Zotz in an intimate class (only 4 participants) to get stronger, gain endurance and stretch those muscles.",
        },
        {
            class: "Weight Lifting Class",
            description: "TBA",
        },
        {
            class: "Yoga Stretch",
            description:
                "Class will focus on deep breaths, mindfulness and stretching. Focus will be on relaxation and gentle movements.",
        },
        {
            class: "Zumba",
            description:
                "Dance-based aerobics using up-tempo Latain muscis styles such as Pop, Hip Hop, Latin, and international rhythms and beats to party ourselves into shape! The routines feature aerobic interval training with a combination of fast and slow shythms. It targets areas such as the glute, legs, arms and abdominals.",
        },
    ],
    personalTrainerPricing: [
        {
            class: "Weight Room Orientation",
            session: "",
            solo: "$25",
            dual: "",
            quad: "",
        },
        {
            class: "Fitness Assessment",
            session: "",
            solo: "$25",
            dual: "",
            quad: "",
        },
        {
            class: "Personal Training",
            session: "1 Session",
            solo: "$30",
            dual: "$50",
            quad: "$80",
        },
        {
            class: "",
            session: "3 Sessions",
            solo: "$85",
            dual: "$120",
            quad: "$175",
        },
        {
            class: "",
            session: "5 Sessions",
            solo: "$135",
            dual: "$180",
            quad: "$265",
        },
        {
            class: "",
            session: "10 Sessions",
            solo: "$250",
            dual: "$350",
            quad: "$500",
        },
    ],
    staff: [
        "/images/programs/members/6k2ewu7po408d2w7.jpg",
        "/images/programs/members/6ryrd8jt7dn89gpw.jpg",
        "/images/programs/members/82v53up0434dw3eg.jpg",
        "/images/programs/members/w6pm7vxdhd0eqtil.jpg",
        "/images/programs/members/xtc0zj5ws74uwr1r.jpg",
        "/images/programs/members/bp46ug2eocjkco44.jpg",
        "/images/programs/members/kwemg5ikz4zrlel1.jpg",
    ],
};
