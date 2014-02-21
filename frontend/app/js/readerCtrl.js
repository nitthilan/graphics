/* Controllers */
MyAppControllers.controller('readerCtrl', ['$scope', '$resource', '$location', 'SessionService', 
                function($scope, $resource, $location, SessionService) {
    'use strict';
    $scope.logout = function(){
      console.log("LogOut");
      SessionService.setUserAuthenticated(false);
      var serverAuth = $resource('api/v1/session/logout', {}, 
        { logout: {method:'GET'}});
      serverAuth.logout();
      $location.path( "/view1" );
    };
    
    var Subscriptions = $resource('reader/subscriptions',{}, {
      get: {method:'GET', isArray: true, headers: [{'Content-Type': 'application/json'}, {'Accept': 'application/json'}]}
      });
    $scope.subscriptions = Subscriptions.get();

    $scope.addFeedMessage = "Enter a rss feed";
    $scope.add = function(feed){
      var postSub = $resource('reader/subscriptions/xmlUrl',{}, {
        add: {method:'POST', headers: [{'Content-Type': 'application/json'}, {'Accept': 'application/json'}]}
      });
      postSub.add({},{url:feed}, function(response){
        console.log(response);
        $scope.addFeedMessage = "Feed added successfully: "+JSON.stringify(response.name);
        $scope.articles = response.articles;
        $scope.subscriptions = Subscriptions.get();
        $scope.feedUrl = null;
        $scope.listedSubscription = response;
      },
      function(err){
        console.log(err.data);
        console.log(JSON.stringify(err));
        $scope.addFeedMessage = "Error in adding feed:"+JSON.stringify(err.data);
      });
    };

    $scope.getArticle = function(subscription){
      console.log(JSON.stringify(subscription));
      var Articles = $resource('reader/articles/:id',{}, {
        get: {method:'GET', isArray: true, headers: [{'Accept': 'application/json'}]}
      });
      $scope.articles = Articles.get({id:subscription._id});
      $scope.listedSubscription = subscription;
    };

    $scope.scrollCallBack = function(){
      console.log("Scroll starts");
    };
    
    /* $scope.subscriptions = [
      {
        id: 909090909,
        name: 'IBN Live',
        type:'rss',
        subscriptionUrl:'https://',
        siteUrl:'https://',
        categories:['news','sports']
      }
    ];*/

 
  }]);
