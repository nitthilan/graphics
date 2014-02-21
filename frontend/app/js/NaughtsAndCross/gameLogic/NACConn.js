MyAppServices.service('NACConn', ['mySocket',function(mySocket){
    'use strict';
    //this.eventHandlers = {};
    //mySocket.forward('game:receive');
    this.send = function(to_userid, app_event, args){
		mySocket.emit("game:send", {
			to_userid:to_userid,
			app_event:app_event,
			args:args
		});
    };
    this.resetAllHandlers = function(){
    	this.eventHandlers = {};
    }
    this.registerHandlers = function(handlers){
    	this.eventHandlers = handlers;
    	//console.log("Event handler registered "+this.eventHandlers+JSON.stringify(handlers));
    };
    this.deRegisterHandler = function(app_event){
    	delete this.eventHandlers[app_event]
    };
    var NACConn_base = this;
    mySocket.on('game:receive', function(data){
    	console.log("Received remote call "+JSON.stringify(data)+" "+JSON.stringify(NACConn_base.eventHandlers));
    	var app_event = data.app_event;
    	if(NACConn_base.eventHandlers[app_event] != null){
    		NACConn_base.eventHandlers[app_event](data.from_userid, data.app_event, data.args);
    	}
    	else{
    		console.log(app_event+" not registered: NACConn");
    	}
    });
}]);