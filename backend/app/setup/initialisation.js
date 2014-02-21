var mongoose = require('mongoose');
var fs = require('fs');
module.exports = function(config){
  var log = require(config.root+'./setup/log.js').appLogger;
  var User = mongoose.model('User');
  // Drop the User table
  User.remove({}, function(err) {
    log.info('User collection removed and added only one user '+err); 
    // Create a user into the table
    var user = new User();
    user.email = 'nitthilan@gmail.com';
    user.password = 'nitthilan';
    user.save();
    var user1 = new User();
    user1.email = 'nitthilan1@gmail.com';
    user1.password = 'nitthilan';
    user1.save();

  });
}
