// Modules
var restify = require("restify"),
    mongoose = require('mongoose'),
    bunyan = require('bunyan'),
    socket = require('socket.io');

// Create Logging for application
var logger = require('./log.js');
var log = logger.appLogger;

// Load configurations
var env = process.env.NODE_ENV || 'development' ,
    config = require('./config')[env];

// Paths
var config_path = config.root + '/lib/config'

// Database configuration
var connectStr = config.db_prefix +'://'+config.host+':'+config.db_port+'/'+config.db_name;
log.info(connectStr);
mongoose.connect(connectStr);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  log.info("Database connection opened.");
});


log.info("Loading all models");
require(config.root+'./user_accounts/user_model.js')

// Configure the server
var app = restify.createServer({
  //certificate: ...,
  //key: ...,
  name: 'crud-test',
    version: config.version
});

// restify settings
require(config.root + './setup/restify')(app, config, logger.restLogger);
// Configuring socket io
var io = socket.listen(app);
require(config.root + './user_accounts/socket_authentication.js')(io, config);

io.sockets.on('connection', function (socket) {
	//log.info("Connection established with client");
	require(config.root + './collaboration/active_users_routes.js')(socket, config);
});


// Bootstrap routes
var auth = require(config.root + './user_accounts/authentication.js');
require(config.root + './setup/routes.js')(app, config, auth);


// Initialise the application
require(config.root + './setup/initialisation.js')(config);

// Start the app by listening on <port>
var port = process.env.PORT || config.port;
app.listen(port);
log.info('App started on port ' + port);

