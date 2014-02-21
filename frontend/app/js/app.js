
window.routes =
{
  "/login": {
    templateUrl: 'partials/login.html', 
    controller: 'loginCtrl', 
    requireLogin: false
  },
  "/reader": {
    templateUrl: 'partials/reader.html', 
    controller: 'readerCtrl', 
    requireLogin: false
  },
  "/movie": {
    templateUrl: 'partials/movie.html', 
    controller: 'movieCtrl', 
    requireLogin: false
  },
  "/naughtsandcrosses": {
    templateUrl: 'partials/naughtsandcrosses.html', 
    controller: 'notsandcrossCtrl', 
    requireLogin: false
  }
};
// Declare app level module which depends on filters, and services
var MyApp = angular.module('myApp', ['btford.socket-io','myApp.filters', 'myApp.services', 'myApp.directives', 
                            'myApp.controllers', 'ngResource', 'ngSanitize', 'ui.event']).
factory('mySocket', ['socketFactory', function (socketFactory) {
  var socket = socketFactory();
  socket.forward('error');
  return socket;
}]);
var MyAppControllers = angular.module('myApp.controllers', []);
var MyAppServices = angular.module('myApp.services',[]);



MyApp
.config(['$routeProvider', function($routeProvider) {
  for(var path in window.routes){
    $routeProvider.when(path, window.routes[path]);
  }
  $routeProvider.otherwise({redirectTo: '/login'});
}])
.run(['$rootScope','$location', 'SessionService',function($rootScope, $location, SessionService){
  /* if(!SessionService.getUserAuthenticated()){
    $location.path('/login');
  } */
  $rootScope.$on("$locationChangeStart", function(event, next, current) {
    for(var i in window.routes) {
      if(next.indexOf(i) != -1) {
        if(window.routes[i].requireLogin && !SessionService.getUserAuthenticated()) {
          alert("You need to be authenticated to see this page!");
          event.preventDefault();
        }
      }
    }
  });
}]);

