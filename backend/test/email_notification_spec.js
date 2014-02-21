describe("Validating email format for notification", function(){
	var config = require('../app/setup/config.js')['development'];
	var email_notification = require(config.root+'./user_accounts/email_notification.js')(config);
	email_notification.sendUserInfo("nitthilan@yahoo.com", "mypassword");
});