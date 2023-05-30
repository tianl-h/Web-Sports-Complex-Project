const mongoose = require('mongoose');
const Membership = require('./models/membership'); 

const memberships = [
  {
        type: "Fall or Spring Trial Membership",
        duration: "30",
        price: "60"
  },

  {
    type: "Seasonal Comprehensive Membership",
    duration: "120",
    price: "150"
  },
  {
    type: "Annual Comprehensive Membership",
    duration: "360",
    price: "300"
  }
];

async function initializeMemberships() {
  try {
    const count = await Membership.countDocuments();

    if (count === 0) {
      console.log('No memberships found, initializing default memberships...');
      await Membership.insertMany(memberships);
      console.log('Default memberships initialized successfully.');
    } else {
      console.log('Memberships already exist, skipping initialization.');
    }
  } catch (error) {
    console.error('Error initializing events:', error);
  }
}

module.exports = initializeMemberships;
