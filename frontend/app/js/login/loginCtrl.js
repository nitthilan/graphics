/* Controllers */
MyAppControllers.controller('loginCtrl', ['$scope', '$resource', '$location', 'SessionService', 'mySocket',
    function($scope, $resource, $location, SessionService, mySocket) {
    'use strict';
    $scope.$on('socket:error', function (ev, data) {
       console.log("Connection not succesful");
    });
    $scope.loginMessage = "Not logged in";
    $scope.login = function(username,password){
      var outer = this;
      console.log("Login button clicked", outer.email, outer.password);
      
      var serverAuth = $resource('api/v1/session/login', {}, 
          { login: {method:'POST', params:{email:outer.email,password:outer.password}} });
      serverAuth.login(function(response){
        //console.log("Login successful: ", response);
        SessionService.setUserAuthenticated(true);
        mySocket.reconnect();
        //console.log("User authenticated ", SessionService.getUserAuthenticated());
        $location.path( "/naughtsandcrosses" );
      }, 
      function(err){
        //console.log("Login", JSON.stringify(err));
        $scope.loginMessage = "Login Failed "+err.data.message;
      });
    };
    $scope.create = function(){
      var outer = this;
      console.log("Create button clicked", outer.email, outer.password);
      
      var create = $resource('api/user', {}, 
        { login: {method:'POST', params:{email:outer.email,password:outer.password}} });
      create.login(function(response){
        $scope.loginMessage = "User created. Try login.";
        $scope.email = null;
        $scope.password = null;
      }, 
      function(err){
        //console.log("Login", JSON.stringify(err));
        $scope.loginMessage = "User creation failed. "+err.data.message;
      });
    };
  }]);
