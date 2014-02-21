var mongoose = require('mongoose')
, User = mongoose.model('User')
, restify = require('restify');

module.exports = function (app, config, auth) {
  var log = require(config.root+'./setup/log.js').appLogger;
  var email_notification = require(config.root+'./user_accounts/email_notification.js')(config);
  var active_users = require(config.root+'./collaboration/active_users.js')(config);

  function loginSteps(req, user){
    req.session.user = user._id;
    active_users.add(user);
  }
  function logOffSteps(req, id){
    active_users.remove(id);
    req.session.reset();
  }

  //Callback for response of asyn call
  function createLoginReponse(req, res, next){
    return function(err, user){
      log.info("error "+err+" user "+user);
      if (err) { 
        logOffSteps(req, user);        
        res.send(403, err);
        return next();
      }
      else if (!user) {
        logOffSteps(req, user);
        res.send(403, new Error('Unknown user'));
      }
      else if (user.authenticate(req.params.password)) {
        loginSteps(req, user);
        res.send(user);
      } else {
        logOffSteps(req, req.session.user);
        res.send(403, new Error('Invalid password'));
      }
      return next();
    }
  }
  function createUser(req, res, next){
    return function(err, user){
      log.info("error "+err+" user "+user);
      if (err) { 
        res.send(403, err);
        return next();
      }
      else if (user) {
        res.send(403, new Error('User already exists'));
      }
      else {
        // Email th euser about the account information
        email_notification.sendUserInfo(req.params.email, 
          req.params.password);
        // Create a user into the table
        var user = new User();
        user.email = req.params.email;
        user.password = req.params.password;
        user.save(function (err, user, numberAffected) {
          if (err) res.send(err);
          else{
            res.send(user);
          }
        });
      }
      return next();
    }
  }

  // API function
  // Search by Username
  function login(req, res, next) {
    var query = User.where( 'email', new RegExp('^'+req.params.email+'$', 'i') );
    query.findOne(createLoginReponse(req, res, next));
  }

  function logout(req, res, next) {
    logOffSteps(req, user);
    res.send({});
  }
  function create(req, res, next){
    var query = User.where( 'email', new RegExp('^'+req.params.email+'$', 'i') );
    query.findOne(createUser(req, res, next));
  }
  function update(req, res, next){
    res.send({});
  }

  // Set up routes 

  // Ping but with user authentication
  app.get('/api/auth', auth.requiresLogin, function (req, res) {
    res.send({'message':'Success'});
  });

  // Login
  app.post('/api/v1/session/login', login);
  // Logout
  app.get('/api/v1/session/logout', logout);

  app.post('/api/user', create);
  app.put('/api/user', update);
}



