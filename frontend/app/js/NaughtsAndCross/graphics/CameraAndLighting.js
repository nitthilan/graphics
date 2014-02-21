MyAppServices.service('CameraAndLighting', function(){
	'use strict';
	this.init = function(width, height, distance_from_scene){
		this.theta = 0;// Rotation angle about Y axis
		this.phi = 0; // Rotation angle about X Axis
		this.radius = distance_from_scene;
		this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 4000);
        /* camera = new THREE.OrthographicCamera( 10 / - 2, 10 / 2, 
          10 / 2, 10 / - 2, 1, 1000 ); */
        this.camera.position.set( 0, 0, distance_from_scene );
	};
	this.offsetCamera = function(direction){
		var offsetStep = 5;
		if(direction === "up"){ 
			this.phi += offsetStep;
			if(this.phi >= 90) {this.phi = 90;}
		}
		if(direction === "down"){ 
			this.phi -= offsetStep;
			if(this.phi <= -90) {this.phi = -90;}
		}
		if(direction === "left"){ this.theta -= offsetStep;}
		if(direction === "right"){ this.theta += offsetStep;}
	};
	this.getCamera = function(lookAtDirection){
		//console.log( " Angles "+this.theta+" "+this.phi);
		var thetaRad = THREE.Math.degToRad(this.theta);
		var phiRad = THREE.Math.degToRad(this.phi);
		this.camera.position.y = this.radius * Math.sin(phiRad);
		this.camera.position.x = this.radius * Math.cos(phiRad) * Math.sin(thetaRad);
		this.camera.position.z = this.radius * Math.cos(phiRad) * Math.cos(thetaRad);
		this.camera.lookAt(lookAtDirection);
		//console.log("New position "+this.phi+" "+this.theta);
		return this.camera;
	};
	this.getLighting = function(){
		// Create a group and add above together
        var group = new THREE.Object3D();
        group.add(new THREE.AmbientLight(0x404040));
        // Create a directional light to show off the object
        var light = new THREE.DirectionalLight( 0xffffff, 1.5);
        light.position.set(0, 0, 1);
        group.add(light);
        return group;
	};
	this.getCameraAngles = function(){
		return {
			theta: this.theta,
			phi: this.phi
		};
	};
	var getOffset = function(x){
		var y = Math.floor(x*1.5 + 1.5 - 0.01);
		if(y <= 0) y = 0;
		return y;
	};
	this.getGridOffsets = function(){
		var theta = this.theta;
		var phi = this.phi;
		console.log("Angles "+theta+" "+phi);
		var modTheta = theta%360;
		var modPhi = phi%360;
		var delta = 22.5; // The area for input
		modPhi = Math.floor((modPhi + (delta/2))/delta) * delta;
		modTheta = Math.floor((modTheta + (delta/2))/delta) * delta;
		var thetaRad = THREE.Math.degToRad(modTheta);
		var phiRad = THREE.Math.degToRad(modPhi);

		// offset value
		var y = Math.sin(phiRad);
		var x = Math.cos(phiRad) * Math.sin(thetaRad);
		var z = Math.cos(phiRad) * Math.cos(thetaRad);

		console.log("offsets "+x+" "+y+" "+z);

		x = getOffset(x);
		y = getOffset(y);
		z = getOffset(z);
		return [x,y,z];
	};

});