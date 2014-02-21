/* Controllers */
MyAppControllers.controller('notsandcrossCtrl', ['$scope',
  'NACCoinAndGrid','NaughtsAndCrossPlayer','NaughtsAndCrossGrid','CameraAndLighting', 
  '$resource', 'mySocket', 'NACConn',
    function($scope, NACCoinAndGrid, NaughtsAndCrossPlayer, NaughtsAndCrossGrid,
      CameraAndLighting, $resource, mySocket, NACConn) {
      'use strict';

      var renderer = null, scene = null, container = null;

      var opponentQueryInfo = null;
      var preventMove = false;

      //var radius = 10, theta = 0;
      $scope.nextPlayer = NaughtsAndCrossPlayer.getCurrentPlayer();
      $scope.errorMessage = null;
      $scope.activeUsers = null;
      $scope.positiveResponseFromOpponentUser = null;//"Challenge Accepted";
      $scope.negativeResponseFromUser = null;
      $scope.queryFromOpponentUser = null;//"Accept challenge from player 1";
      mySocket.forward('presence:activeUsers');
      mySocket.forward('game:query');
      mySocket.forward('game:response');
      mySocket.forward('game:start');
      $scope.$on('socket:presence:activeUsers', function (en, data) {
        console.log("Getting active users "+JSON.stringify(data));
        $scope.activeUsers = data;
        $scope.$apply();
      });
      // Initially enable the Easel screen
      $scope.disableEasel = false;
      //$scope.disableContainer = false;

      $scope.gameOn = function(opponentUser){
        console.log("Sending trigger to opponent "+opponentUser.email);
        // $scope.responseFromOpponentUser = "Accept "+opponentUser.email+"'s challenge";
        mySocket.emit("game:query",{
          to_userid:opponentUser._id,
          query:"Ready for a game"
        });
      };
      $scope.AcceptQuery = function(){
        mySocket.emit("game:response",{
          to_userid:opponentQueryInfo.from_userid,
          response:"yes"
        });
        $scope.queryFromOpponentUser = null;
        opponentQueryInfo = null;
      };
      $scope.RejectQuery = function(){
        mySocket.emit("game:response",{
          to_userid:opponentQueryInfo.from_userid,
          response:"no"
        });
        $scope.queryFromOpponentUser = null;
        opponentQueryInfo = null
      };
      $scope.$on('socket:game:query', function (en, data) {
        console.log("Query from opponent "+JSON.stringify(data));
        var email = $scope.activeUsers[data.from_userid].email;        
        $scope.queryFromOpponentUser = email+":"+data.query;
        opponentQueryInfo = data;
        $scope.$apply();
      });
      $scope.$on('socket:game:response', function (en, data) {
        console.log("Response from opponent "+JSON.stringify(data));
        var email = $scope.activeUsers[data.from_userid].email;
        if(data.response === "yes"){
          $scope.positiveResponseFromOpponentUser = email+" accepted your challenge";
          $scope.opponent_id = data.from_userid;
        }
        else{
          $scope.negativeResponseFromUser = email+" is not available for challenge";
        }
        $scope.$apply();
      });
      $scope.$on('socket:game:start', function (en, data) {
        console.log("Start game received "+JSON.stringify(data));
        $scope.positiveResponseFromOpponentUser = null;
        $scope.disableEasel = true;
        $scope.$apply();
      });
      $scope.startGame = function(){
        $scope.positiveResponseFromOpponentUser = null;
        $scope.disableEasel = true;
        preventMove = false;
        NACConn.send($scope.opponent_id, "startGame", {startPlayer:0});
      };
      var stopGame = function(){
        $scope.disableEasel = false;
        $scope.$apply();
        NACConn.send($scope.opponent_id, "stopGame", {startPlayer:0});
      }

      var opponentFunctions = {
        startGame:function(from_userid, event, args){
          console.log("Remote start game triggered "+JSON.stringify(args)+" "+from_userid+" "+event);
          $scope.disableEasel = true;
          preventMove = true;
          $scope.opponent_id = from_userid;
          $scope.$apply();
        },
        stopGame:function(from_userid, event, args){
          console.log("Remote stop game triggered "+JSON.stringify(args)+" "+from_userid+" "+event);
          $scope.disableEasel = false;
          $scope.$apply();
        },
        makeMove:function(from_userid, event, args){
          makeMove(args.gridOffsets);
          preventMove = false;
        }
      }

      var getGridOffsets = function(isCenter){
        var gridOffsets = [1,1,1];
        if(!isCenter){
          // Get the xyz grid offsets
          gridOffsets = CameraAndLighting.getGridOffsets();
          //console.log("Offsets "+JSON.stringify(gridOffsets));
        }
        return gridOffsets;
      }

      NACConn.registerHandlers(opponentFunctions);
      var makeMove = function(gridOffsets){
        // Validate and Store the state in grid
        try{
          NaughtsAndCrossGrid.setPositionState(gridOffsets[0],gridOffsets[1],gridOffsets[2],
            NaughtsAndCrossPlayer.getCurrentPlayer());
        }catch(error){
          $scope.errorMessage = error;
          return;
        }
        // Check whether the player has won
        if(NaughtsAndCrossGrid.hasThePlayerWon()){
          $scope.errorMessage = $scope.nextPlayer+" wins";
          stopGame();
        }
        else{
          $scope.errorMessage = null;
        }
        // set the player state and toggle
        NaughtsAndCrossPlayer.setPositionAndToggle(gridOffsets[0],gridOffsets[1],gridOffsets[2]);
        //console.log("Error "+$scope.errorMessage);
        // Initialise the view
        $scope.nextPlayer = NaughtsAndCrossPlayer.getCurrentPlayer();
        $scope.$apply();
      };
      var undoMove = function(){
        var lastPlayedState = NaughtsAndCrossPlayer.getlastPlayedState();
        NaughtsAndCrossGrid.resetPositionState(lastPlayedState[0], lastPlayedState[1], lastPlayedState[2]);
        NaughtsAndCrossPlayer.undoLastMove();

        // Remove the last placed coin
        //removeCoin();

        $scope.nextPlayer = NaughtsAndCrossPlayer.getCurrentPlayer();
        $scope.errorMessage = null;
        $scope.$apply();
      };

      function onLoad()
      {
        var width = "800", height = "400";
        var easelHandle = document.getElementById("easelHandle");
        easelHandle.width = width;
        easelHandle.height = height;

        //Create a stage by getting a reference to the canvas
        var stage = new createjs.Stage(easelHandle);
        var background  =  new createjs.Shape();
        background.graphics.beginFill("black").drawRect(0, 0, easelHandle.width, easelHandle.height);
        background.x = 0;
        background.y = 0;
        stage.addChild(background);
        //Create a Shape DisplayObject.
        var circle = new createjs.Shape();
        circle.graphics.beginFill("red").drawCircle(200, 200, 100);
        //Set position of Shape instance.
        //console.log("Width "+easelHandle.width+"height "+easelHandle.height);
        //circle.x = easelHandle.height/2;
        //circle.y = 200;
        //Add Shape instance to stage display list.
        stage.addChild(circle);
        //Create a Shape DisplayObject.
        var circle1 = new createjs.Shape();
        circle1.graphics.beginFill("green").drawCircle(600, 200, 100);
        //Set position of Shape instance.
        //console.log("Width "+easelHandle.width+"height "+easelHandle.height);
        //circle1.x = easelHandle.height/2;
        //circle1.y = 600;
        //Add Shape instance to stage display list.
        stage.addChild(circle1);
        var start = new createjs.Shape();
        start.graphics.beginFill("blue").drawRoundRect(400-50, 200-25, 100, 50, 10);
        stage.addChild(start);
        var text = new createjs.Text("Hello World", "20px Arial", "#ff7700"); 
        text.x = 100; text.textBaseline = "alphabetic";
        stage.addChild(text);
        //Update stage will render next frame
        stage.update();

        // Grab our container div
        container = document.getElementById("container");
        container.style.width = width;
        container.style.height = height;
        
        //console.log("container value "+container.offsetWidth+" "+ container.offsetHeight+" "+container);
        // Create the Three.js renderer, add it to our div
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        container.appendChild( renderer.domElement );

        // initialise camera
        CameraAndLighting.init(container.offsetWidth, container.offsetHeight, 10);
        //NACCoinAndGrid.init(.1,1);        

        // Create a new Three.js scene
        scene = new THREE.Scene();
        scene.add( CameraAndLighting.getLighting() );
        //console.log("The value of grid "+NACCoinAndGrid.getGrid());
        scene.add(NACCoinAndGrid.getGrid());
        // Add a mouse up handler to toggle the animation
        //addEventHandlers(container);
        addEventHandler(container, 'keydown',onKeyDown);

        mySocket.reconnect();

        mySocket.emit('presence:getActiveUsers');
        var queue = new createjs.LoadQueue();
         queue.installPlugin(createjs.Sound);
         queue.on("complete", handleComplete, this);
         queue.loadFile({id:"sound", src:"sound/drum.wav"});
         queue.loadManifest([
             {id: "myImage", src:"img/flower.jpg"}
         ]);
         console.log("Trigger for image load happened");
         function handleComplete() {
            console.log("Image and sound loaded");
             createjs.Sound.play("sound");
             var image = queue.getResult("myImage");
             //document.body.appendChild(image);
         }
        // Run our render loop
        run();
      }
      function run()
      {
        renderer.render(scene, CameraAndLighting.getCamera(scene.position));
        // Ask for another frame
        requestAnimationFrame(run);
      }
      function addEventHandler(elem,eventType,handler) {
       if (elem.addEventListener)
           elem.addEventListener (eventType,handler,false);
       else if (elem.attachEvent)
           elem.attachEvent ('on'+eventType,handler); 
      }
      function onKeyDown(e){
        //console.log("Event "+e.keyCode);
        if(e.keyCode === 37){CameraAndLighting.offsetCamera("left");}
        if(e.keyCode === 38){CameraAndLighting.offsetCamera("up");}
        if(e.keyCode === 39){CameraAndLighting.offsetCamera("right");}
        if(e.keyCode === 40){CameraAndLighting.offsetCamera("down");}
        console.log("State of prevent move "+preventMove);
        if(preventMove === false){
          if(e.keyCode === 81){
            makeMove(getGridOffsets(false));
            NACConn.send($scope.opponent_id, "makeMove", {gridOffsets:getGridOffsets(false)});
          }
          if(e.keyCode === 87){
            makeMove(getGridOffsets(true));
            NACConn.send($scope.opponent_id, "makeMove", {isCenter:getGridOffsets(true)});
          }
          if(e.keyCode === 81 || e.keyCode === 87){
            preventMove = true;
          }
        }
        if(e.keyCode === 69){undoMove();}
      }
      onLoad();
}]);