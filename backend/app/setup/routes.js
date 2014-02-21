var restify = require('restify') ,
    fs = require('fs') ,
    mongoose = require('mongoose');

module.exports = function (app, config, auth){ //, smtpTransport) {

  // Is application alive ping
  app.get('/api', function (req, res) {
    //console.log(req);
    res.send({'message':'Success'});
  });

  //
  // I looked at header based API versioning, not a fan, but also when I tried this, the atatic resource GETs hang
  //    app.get({path : '/db', version : '1.0.0'}, ...
  //    app.get({path : '/db', version : '2.0.0'}, ...

  // Is database alive ping
  app.get('/db', function (req, res) {
    var result = '';
    mongoose.connection.db.executeDbCommand({'ping':'1'}, function(err, dbres) {
      if (err === null) {
        res.send(dbres);
      } else {
        res.send(err);
      }
    });
  });

  require(config.root + './user_accounts/user_routes.js')(app, config, auth);

  app.get(/\/?.*/, restify.serveStatic({
    directory: config.static_path,
    default:'index.html',
    maxAge: 0
  }));
  
}

