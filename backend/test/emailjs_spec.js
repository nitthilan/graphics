describe("validating mail functionality", function(){
	var email   = require("emailjs/email");
	var server  = email.server.connect({
	   user:    "projectdevan@gmail.com", 
	   password:"allworldisastage", 
	   host:    "smtp.gmail.com", 
	   ssl:     true

	});

	// send the message and get a callback with an error or details of the message that was sent
	server.send({
	   text:    "i hope this works", 
	   from:    "projectdevan <projectdevan@gmail.com>", 
	   to:      "nitthilan <nitthilan@gmail.com>",
	   cc:      "else <else@gmail.com>",
	   subject: "testing emailjs"
	}, function(err, message) { console.log(err || message); });
});