var email   = require("emailjs/email");

module.exports = function (config) {
	var config_secret = require(config.root+'./setup/config_secret.js')["development"];
	var log = require(config.root+'./setup/log.js').appLogger;
	var server  = email.server.connect({
	   user: config_secret.smtp_username, 
	   password: config_secret.smtp_password, 
	   host:"smtp.gmail.com", 
	   ssl: true
	});

	function sendUserInfo(email,password){
		// send the message and get a callback with an error or details of the message that was sent
		server.send({
		   text: "Hi, \nThank you for creating a account with project devan.\
		   \n Email Id: "+email+"\n Password: \""+password+"\"\n",
		   from: config_secret.smtp_username, 
		   to: email,
		   cc: config_secret.smtp_username,
		   subject: "Project Devan Account Creation"
		}, function(err, message) { log(err || message); });
	}

	return{
		sendUserInfo: sendUserInfo
	}
}