const mongoose = require('mongoose');
const Facility = require('./models/facilities'); // Adjust the path to your Facility model if needed

const facilities = [   
    { name: "CORDISH TENNIS CENTER",   
        type: "Tennis",     
        images: [          
        "/images/facilities/tennis1.jpg",          
        "/images/facilities/tennis2.jpg",          
        "/images/facilities/tennis3.jpg"        ],
        description: "Ace your game at the Cordish Tennis Center! Our indoor and outdoor tennis courts offer a world-class playing experience for players of all skill levels. Whether you're a seasoned pro or a beginner just learning the ropes, our courts are the perfect place to improve your skills, meet new friends, and have fun."
    },
    {
        name: "STEIN BASEBALL DIAMOND",
        type: "Baseball",
        images: [
        "/images/facilities/baseball1.jpg",
        "/images/facilities/baseball2.jpg",
        ],
        description: "Step up to the plate and swing for the fences at the Stein Baseball Diamond! Our state-of-the-art facility is the perfect place to play America's favorite pastime. With well-manicured fields and top-of-the-line equipment, you'll feel like a pro as you take your turn at bat or field ground balls with your team. So come on down to the Stein Baseball Diamond and see what all the fuss is about!"
    },
    {
        name: "BASKETBALL COURTS",
        type: "Basketball",
        images: [
        "/images/facilities/basketball1.jpg",
        "/images/facilities/basketball2.jpg",
        "/images/facilities/basketball3.jpg"
        ],
        description: "Get ready to shoot some hoops at our regulation-sized basketball courts! Whether you're looking to improve your jump shot, play a game of pickup with friends, or just get some exercise, our courts are the perfect place to do it. With smooth surfaces and top-quality equipment, you'll feel like you're playing in the big leagues. So lace up your sneakers, grab your ball, and come on down to our basketball courts today!"
    },
    {
        name: "LINSEY POOL",
        type: "Swimming Pool",
        images: [
        "/images/facilities/pool1.jpg",
        "/images/facilities/pool2.jpg",
        "/images/facilities/pool3.jpg"
        ],
        description: "Welcome to our university pool facility, where you can make a splash and dive into the perfect oasis of relaxation and recreation! Whether you want to cool off on a hot summer day, stay in shape, or simply unwind after a long day of classes, our pool is the ultimate destination for all your aquatic needs."
    },
    {
        name: "FITNESS CENTER",
        type: "Fitness",
        images: [
        "/images/facilities/fitness1.jpg",
        "/images/facilities/fitness2.jpg",
        "/images/facilities/fitness3.jpg",
        "/images/facilities/fitness4.jpg"
        ],
        description: "Get your sweat on at our modern fitness center! Equipped with state-of-the-art cardio and weight equipment, our center has everything you need to get fit and toned. Whether you're looking to shed a few pounds, build muscle, or just maintain your health, our friendly staff and comfortable atmosphere will help you reach your goals. So come on down to our fitness center and start feeling great today!"
    }
];

async function initializeFacilities() {
  try {
    const count = await Facility.countDocuments();
    
    if (count === 0) {
      console.log('No facilities found, initializing default facilities...');
      await Facility.insertMany(facilities);
      console.log('Default facilities initialized successfully.');
    } else {
      console.log('Facilities already exist, skipping initialization.');
    }
  } catch (error) {
    console.error('Error initializing facilities:', error);
  }
}

module.exports = initializeFacilities;
