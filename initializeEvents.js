const mongoose = require('mongoose');
const Event = require('./models/events'); // Adjust the path to your Event model if needed

const events = [
  {
    name: "Tennis Tournament",
    date: "2023-05-06",
    location: "Brandeis Indoor Tennis Court",
    time: "09:00 AM",
    description: "Join us for the annual Brandeis Tennis Tournament! Whether you're a seasoned player or new to the game, come showcase your skills and compete against other tennis enthusiasts. Don't miss this exciting opportunity to play, connect with others, and possibly take home the championship title. Register now to secure your spot!",
    images: "/images/tennisTournament.jpeg"
  },
  {
    name: "Charity Sports Event",
    date: "2023-05-20",
    location: "Brandeis Sport Center",
    time: "10:00 AM",
    description: "Join us for a day of fun and fundraising at our annual charity sports event! Whether you're a seasoned athlete or just enjoy a casual game, come out and support a great cause while playing your favorite sports. All proceeds will go towards supporting a local charity that helps provide resources and opportunities for underprivileged youth in our community. Let's make a difference together!",
    images: "/images/charity.jpeg"
  },
  {
    name: "Pickleball Tournament",
    date: "2023-06-03",
    location: "Brandeis Outdoor Tennis Court",
    time: "02:00 PM",
    description: "Get ready for some fast-paced fun at Brandeis' Pickleball Tournament! This growing sport combines elements of tennis, badminton, and ping pong for a unique and exciting playing experience. Whether you're a seasoned player or new to the game, all skill levels are welcome to join in on the action.",
    images: "/images/pikleball.png"
  }
];

async function initializeEvents() {
  try {
    const count = await Event.countDocuments();

    if (count === 0) {
      console.log('No events found, initializing default events...');
      await Event.insertMany(events);
      console.log('Default events initialized successfully.');
    } else {
      console.log('Events already exist, skipping initialization.');
    }
  } catch (error) {
    console.error('Error initializing events:', error);
  }
}

module.exports = initializeEvents;
