
/**
 *  * Module dependencies.
 */

var restify = require('restify'),
    clientSessions = require("client-sessions"),
    node_restify_validator = require('node-restify-validation');

module.exports = function (app, config, restLogger) {
  app.use(restify.acceptParser(app.acceptable));
  app.use(restify.authorizationParser());
  app.use(restify.dateParser());
  app.use(restify.queryParser());
  app.use(restify.jsonp());
  app.use(restify.gzipResponse());
  app.use(restify.bodyParser());
  // Validating rest calls
  app.use(node_restify_validator.validationPlugin( { errorsAsArray: false }));
  // Cross domain? Need to verify if this is required for this app
  // http://stackoverflow.com/questions/14338683/how-can-i-support-cors-when-using-restify
  app.use(restify.CORS());
  app.use(restify.fullResponse());


  //new Buffer("Hello World").toString('base64')
  //findOne SessionKey
  // if not found create one and use it's key

  app.use(clientSessions(config.cookieSetting));

  app.use(restify.throttle({
    burst: 100,
    rate: 50,
    ip: true,
    overrides: {
      '192.168.1.1': {
        rate: 0,        // unlimited
    burst: 0
      }
    }
  }));
  app.use(restify.conditionalRequest());
  // Enabling auditing
  app.on('after', restify.auditLogger({
      log:restLogger
  }));
  
}

