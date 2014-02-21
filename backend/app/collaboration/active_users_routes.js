var activeSockets = {};
var mongoose = require('mongoose'),
	User = mongoose.model('User');

module.exports = function (socket, config) {
	var log = require(config.root+'./setup/log.js').appLogger;
	var active_users = require(config.root+'./collaboration/active_users.js')(config);
	var initimateAll = function(){
		// This is a hack. Ideally this should be optimised by either 
		// - broadcasting to only the concerned parties like friends on every connection
		// - transmitted once every 1-2 minutes using a timer to all active connections
		// Currently broadcasting to all.
		for(user in activeSockets){
			var activeUsers = active_users.getClone();
			delete activeUsers[user];
			activeSockets[user].emit('presence:activeUsers', activeUsers);
			log.info("Emitted user presence info "+JSON.stringify(activeUsers));
		}
	}

	// Store the socket information based on the user id
	var user_id = socket.handshake.session_data.user;
	activeSockets[user_id] = socket;
	socket.set('user_id', user_id);
	User.findById(user_id, function(err, user){
		if(!err){
			active_users.add(user);
		}
		else{
			log.info("Error in finding user");
		}
		
	});

	log.info("Connected with client "+user_id);	
	log.info("List of sockets "+JSON.stringify(Object.keys(activeSockets)));

	socket.on('message', function(data, cb){
		log.info("Data "+JSON.stringify(data));
		log.info("cb "+JSON.stringify(cb));
	});

	socket.on('game:query', function(data){
		log.info("Query data received "+JSON.stringify(data));
		socket.get('user_id', function(err, user_id){
			log.info("Socket info "+activeSockets[data.to_userid]);
			if(activeSockets[data.to_userid] != null){
				activeSockets[data.to_userid].emit('game:query',{
					from_userid:user_id,
					query:data.query
				});
			}
			else{
				activeSockets[user_id].emit('game:response',{
					from_userid:-1,
					response:"Error"
				});
			}
		});
	});
	socket.on('game:send', function(data){
		log.info("Query data received "+JSON.stringify(data));
		socket.get('user_id', function(err, user_id){
			log.info("Socket info "+activeSockets[data.to_userid]);
			if(activeSockets[data.to_userid] != null){
				// Append sender info
				data["from_userid"] = user_id
				activeSockets[data.to_userid].emit('game:receive',data);
			}
			else{
				data["from_userid"] = -1;
				data["response"] = "Error";
				activeSockets[user_id].emit('game:receive', data);
			}
		});
	});
	socket.on('game:response', function(data){
		socket.get('user_id', function(err, user_id){
			if(activeSockets[data.to_userid]){
				activeSockets[data.to_userid].emit('game:response',{
					from_userid:user_id,
					response:data.response
				});
			}
			else{
				activeSockets[user_id].emit('game:response',{
					from_userid:-1,
					response:"Error"
				});
			}
		});
	});


	/* Not require as of now socket.on('presence:getActiveUsers', function(){
		log.info("Received trigger from client");
		var active_users = active_users.getAll();
		// remove the info about the connected user
		delete active_users[user_id];
		socket.emit('presence:activeUsers', );
	}); */
	socket.on('disconnect', function(){
		log.info("Client disconnected session");
		socket.get('user_id', function(err, user_id){
			log.info("Disconnected user "+user_id);
			delete activeSockets[user_id];
			active_users.remove(user_id);
			// intimate all connected that user has logged off
			initimateAll();
		});
	});
	// intimate all connected that user has logged in
	initimateAll();
}