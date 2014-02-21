describe("Validation of the state machine for active users", function(){
	var mongoose = require('mongoose');
	var config = require('../app/setup/config.js')['development'];
	require(config.root+'./user_accounts/user_model.js')	
	var active_users = require(config.root+'./collaboration/active_users.js')(config);
	var User = mongoose.model('User');


	it('validate get all returns all added',function(){
		var user1 = new User();
	    user1.email = 'nitthilan@gmail.com';
	    user1.password = 'nitthilan';

	    active_users.add(user1);

	    var user2 = new User();
	    user2.email = 'nitthilan1@gmail.com';
	    user2.password = 'nitthilan';
	    active_users.add(user2);

	    var activeUserArray = active_users.getAll();
	    for(var i=0;i<activeUserArray.length;i++){
	    	console.log(JSON.stringify(activeUserArray[i]));
	    }

	    var user3 = new User();
	    active_users.remove(user3._id);

	    active_users.remove(user2._id);

	    //active_users.add(user2);
	    var activeUserArray = active_users.getAll();
	    for(var i=0;i<activeUserArray.length;i++){
	    	console.log(JSON.stringify(activeUserArray[i]));
	    }


	});

});