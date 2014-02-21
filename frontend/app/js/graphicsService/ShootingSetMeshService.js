MyAppServices.service('ShootingSetMeshService', function(){
    'use strict';

	this.createSetOrientation = function(sizeVec3, rotationVec3, positionVec3){

		// Create the ground as Y Z Axis
		var plane = new THREE.Mesh( new THREE.PlaneGeometry( sizeVec3.x, sizeVec3.y, 100, 100), 
                    new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true } ) );
		plane.rotation.x = Math.PI/2;

        // Create the X, Y, Z axis for orientation
        var material = new THREE.LineBasicMaterial( { color: 0xff0000, opacity: 1, linewidth: 10} );
        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(0,0,0));
        geometry.vertices.push(new THREE.Vector3(0,0,0.25));
        geometry.vertices.push(new THREE.Vector3(0,0,0));
        geometry.vertices.push(new THREE.Vector3(0,0.5,0));
        geometry.vertices.push(new THREE.Vector3(0,0,0));
        geometry.vertices.push(new THREE.Vector3(1,0,0));
        var axis = new THREE.Line( geometry,  material, THREE.LinePieces );
        axis.position.x = -0.1;
        axis.position.z = -0.1;
        
        // Create a group and add above together
        var group = new THREE.Object3D();
        group.add(plane);
        group.add(axis);

        // rotate the group 
        group.rotation.x = rotationVec3.x;
        group.rotation.y = rotationVec3.y;
        group.rotation.z = rotationVec3.z;
        // offset the group
        group.position.x = positionVec3.x;
        group.position.y = positionVec3.y;
        group.position.z = positionVec3.z;

        return group;
	};
});