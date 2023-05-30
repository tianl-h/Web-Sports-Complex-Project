// Define an object named aboutController with an index method that takes in a request and response
const aboutController = {
  index: (req, res) => {
    res.render('about');
  }
};

// Export the aboutController object so it can be used in other parts of the application
module.exports = aboutController;
