/* Controllers */
MyAppControllers.controller('movieCtrl', ['AssembleSceneService' ,
    function(AssembleSceneService) {
      'use strict';
      var renderer = null, scene = null, camera = null, cube = null, animating = false;

      function onLoad()
      {
        // Grab our container div
        var container = document.getElementById("container");
        // Create the Three.js renderer, add it to our div
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        container.appendChild( renderer.domElement );

        // Put in a camera
        camera = new THREE.PerspectiveCamera( 45,
        container.offsetWidth / container.offsetHeight, 1, 4000 );
        /* camera = new THREE.OrthographicCamera( 10 / - 2, 10 / 2, 
          10 / 2, 10 / - 2, 1, 1000 ); */
        camera.position.set( 0, 20, 300);
        //camera.lookAt(0, 2, 3);
        // Create a shaded, texture-mapped cube and add it to the scene
        // First, create the texture map
        var mapUrl = "img/flower.jpg";
        var map = THREE.ImageUtils.loadTexture(mapUrl);
        // Now, create a Phong material to show shading; pass in the map
        var material = new THREE.MeshPhongMaterial({ map: map });
        // Create the cube geometry
        var geometry = new THREE.CubeGeometry(1, 1, 1);
        // And put the geometry and material together into a mesh
        cube = new THREE.Mesh(geometry, material);
        // Turn it toward the scene, or we won't see the cube shape!
        cube.rotation.x = Math.PI / 5;
        cube.rotation.y = Math.PI / 5;
        // Add the cube to our scene
        //scene.add( cube );

        scene = AssembleSceneService.createSettingScene();

        // Add a mouse up handler to toggle the animation
        // Add a mouse up handler to toggle the animation
        addMouseHandler();
        // Run our render loop
        run();
      }
      function run()
      {
        // Render the scene
        render();
        // Spin the cube for next frame
        if (animating)
        {
        cube.rotation.y -= 0.01;
        }
        // Ask for another frame
        requestAnimationFrame(run);
      }
      function render() {

        var timer = Date.now() * 0.0001;

        camera.position.x = Math.cos( timer ) * 2;
        camera.position.z = Math.sin( timer ) * 2;
        camera.lookAt( scene.position );

        renderer.render( scene, camera );

      }
      function addMouseHandler()
      {
        var dom = renderer.domElement;
        dom.addEventListener( 'mouseup', onMouseUp, false);
      }
      function onMouseUp (event)
      {
        event.preventDefault();
        animating = !animating;
      }
      onLoad();
  }]);
