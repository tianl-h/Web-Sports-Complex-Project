const mongoose = require("mongoose");
const Program = require("./models/program"); // Adjust the path to your Facility model if needed

const programs = [
    {
        name: "Yoga",
        description: "Learn the basics of yoga.",
        schedule: "Mondays 6pm",
        instructor: "John Smith",
    },
    {
        name: "Pilates",
        description: "A dynamic Pilates class.",
        schedule: "Fridays at 4pm",
        instructor: "Jane Li",
    },
    {
        name: "Adult Learn to Swim",
        description: "3 week course (please plan to attend all 3 dates, March 8, 15 and 22, 11-11:45am). Open to Graduate Students and Staff/Faculty to learn the basics of swimming and water safety. Email kpage@brandeis.edu to register.",
        schedule: "March 8, 15, and 22 at 11-11:45am",
        instructor: "Kathleen Page",
    },
    {
        name: "Cycle",
        description: "Come join our Brandeis cycle community! Feed off the incredible energy in the room with a combination or endurance and strength building intervals. With a mix of fast sprints and heavy climbs, all timed to the beat of the music, you'll be counting down the hours till you're back on the saddle once again.",
        schedule: "Tuesdays and Thursdays at 5pm",
        instructor: "Mike Johnson",
    },
    {
        name: "Cycle n Core",
        description: "20 minutes on the bike to get that heart rate up and then 20 minutes to chisel and tone your core!",
        schedule: "Mondays at 5pm",
        instructor: "Sarah Lee",
    },
    {
        name: "Faculty/Staff Yoga (F/S Yoga)",
        description: "45 minute session to reset, refresh and recharge! Offered up in Skyline so faculty/staff can easily access the space and minimize time away from the office!",
        schedule: "Wednesdays at 12pm",
        instructor: "Amanda Chen",
    },
    {
        name: "Krava Maga",
        description: "Join Miriam in this hour long class that focuses on dynamic self defense movements. Effective, modern and used by the Israeli Defense Forces",
        schedule: "Fridays at 6pm",
        instructor: "Miriam Goldberg",
    },
    {
        name: "Pilates",
        description: "Hour long class to promote body awareness using small muscle movements. Helps improve flexibility and strength.",
        schedule: "Thursdays at 11am",
        instructor: "Samantha Lee",
    },
    {
        name: "TRX",
        description: "Great way to start you day!! Using just your body weight, join Coach Zotz in an intimate class (only 4 participants) to get stronger, gain endurance and stretch those muscles.",
        schedule: "Mondays and Wednesdays at 7am",
        instructor: "Coach Zotz",
    },
    {
        name: "Weight Lifting Class",
        description: "TBA",
        schedule: "TBA",
        instructor: "TBA",
    },
    {
        name: "Yoga Stretch",
        description: "Class will focus on deep breaths, mindfulness and stretching. Focus will be on relaxation and gentle movements.",
        schedule: "Tuesdays and Thursdays at 9am",
        instructor: "Amy Chen",
    },
       
    {   name: "Zumba",
        description:
        "Dance-based aerobics using up-tempo Latin music styles such as Pop, Hip Hop, Latin, and international rhythms and beats to party ourselves into shape! The routines feature aerobic interval training with a combination of fast and slow rhythms. It targets areas such as the glutes, legs, arms, and abdominals.",
        schedule: "Thursdays at 5:30pm",
        instructor: "Jasmine Lee",
    }
];

async function initializePrograms() {
    try {
        const count = await Program.countDocuments();

        if (count === 0) {
            console.log("No program found, initializing default programs...");
            await Program.insertMany(programs);
            console.log("Default programs initialized successfully.");
        } else {
            console.log("Programs already exist, skipping initialization.");
        }
    } catch (error) {
        console.error("Error initializing programs:", error);
    }
}

module.exports = initializePrograms;
