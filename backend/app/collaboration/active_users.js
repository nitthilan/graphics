// http://stackoverflow.com/questions/13179109/singleton-pattern-in-nodejs-is-it-needed
var activeUsers = {};
module.exports = function (config) {
	var log = require(config.root+'./setup/log.js').appLogger;
	var add = function(user){
		activeUsers[user._id] = user;
		//log.info(activeUsers);
	}
	var remove = function(id){
		//log.info("delete"+activeUsers[user._id], user._id);
		delete (activeUsers[id]);
	}
	/* var getAll = function(){
		return activeUsers;
	} */
	// cloning a object: http://my.opera.com/GreyWyvern/blog/show.dml/1725165
	/* Object.prototype.clone = function() {
	  var newObj = (this instanceof Array) ? [] : {};
	  for (i in this) {
	    if (i == 'clone') continue;
	    if (this[i] && typeof this[i] == "object") {
	      newObj[i] = this[i].clone();
	    } else newObj[i] = this[i]
	  } return newObj;
	}; */
	// perfomance based cloning: http://stackoverflow.com/questions/122102/most-efficient-way-to-clone-an-object/5344074#5344074
	var getClone = function(){
		var newActiveUsers = {}
		for(var i in activeUsers){
			newActiveUsers[i] = activeUsers[i];
		}
		return newActiveUsers;
	}
	return {
		add : add,
		remove : remove,
		getClone : getClone
	}
}