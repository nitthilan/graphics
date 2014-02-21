MyAppServices.service('AssembleSceneService', ['ShootingSetMeshService',
    function(ShootingSetMeshService){
    'use strict';

	this.createSettingScene = function(){
        // Create a new Three.js scene
        var scene = new THREE.Scene();

        // Create a directional light to show off the object
        var light = new THREE.DirectionalLight( 0xffffff, 1.5);
        light.position.set(0, 0, 1);
        scene.add( light );

        var orientation = ShootingSetMeshService.createSetOrientation(
            new THREE.Vector3(100, 100, 0), // size
            new THREE.Vector3(0, 0, 0), // orientation
            new THREE.Vector3(0, 0, 0)); // offset
        scene.add(orientation);

        return scene;

	};

}]);