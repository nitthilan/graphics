/* Services */
// Demonstrate how to register services
// In this case it is a simple value service.
MyAppServices.value('version', '0.1');

MyAppServices.service('SessionService', function(){
	'use strict';	
    var userIsAuthenticated = false;

    this.setUserAuthenticated = function(value){
      userIsAuthenticated = value;
    };

    this.getUserAuthenticated = function(){
      return userIsAuthenticated;
    };
  });
