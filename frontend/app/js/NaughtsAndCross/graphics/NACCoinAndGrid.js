MyAppServices.service('NACCoinAndGrid', function(){
    'use strict';

    this.init = function(pole_radius, naught_radius){
        // Now, create a Phong material to show shading; pass in the map
        // var material = new THREE.MeshPhongMaterial({ map: map });
        //var material = new THREE.MeshLambertMaterial( { color: 0xffff00 } );//new THREE.MeshBasicMaterial( { color: 0xffff00 } );
        //var map = THREE.ImageUtils.loadTexture( "img/flower.jpg" );
        //map.wrapS = map.wrapT = THREE.RepeatWrapping;
        //map.anisotropy = 16;

        //this.material = new THREE.MeshLambertMaterial( { ambient: 0xbbbbbb, map: map, side: THREE.DoubleSide } );
        //this.material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
        //this.material = new THREE.MeshLambertMaterial( { color: 0xdddddd, shading: THREE.FlatShading } );
        //this.material = new THREE.MeshLambertMaterial( { color: 0xdddddd, shading: THREE.SmoothShading } );
        //this.material = new THREE.MeshNormalMaterial( );
        //this.material = new THREE.MeshBasicMaterial( { color: 0xffaa00, transparent: true, blending: THREE.AdditiveBlending } )
        /* this.material = new THREE.MeshPhongMaterial( { ambient: 0x030303, color: 0xdddddd, 
            specular: 0x009900, shininess: 30, shading: THREE.FlatShading, 
            map: map, transparent: false } ); */
        //this.material = new THREE.MeshNormalMaterial( { shading: THREE.SmoothShading } );
        //this.material = new THREE.MeshDepthMaterial()
        /*this.material = new THREE.MeshPhongMaterial( { color: 0x000000, specular: 0x666666, emissive: 0x00ff00, 
            ambient: 0x000000, shininess: 10, shading: THREE.SmoothShading, opacity: 1, transparent: false } );*/

        this.pole_radius = pole_radius;
        this.naught_radius = naught_radius;

        this.grid = createGrid(this.pole_radius, this.naught_radius);
    };

    var getCyclinder = function(material, radius, length){
        // Create the cylinder geometry
        var geometry = new THREE.CylinderGeometry( radius, radius, length, 10, 5, false);
        //(radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded)
        // And put the geometry and material together into a mesh
        var cylinder = new THREE.Mesh(geometry, material);
        return cylinder;

    };
    var getNaught = function(naught_radius){
        var material = new THREE.MeshPhongMaterial( { color: 0x000000, specular: 0x666666, 
            emissive: 0x00ff00, ambient: 0x000000, shininess: 10, shading: THREE.SmoothShading, 
            opacity: 1, transparent: false } );
        // Create the cylinder geometry
        var geometry = new THREE.SphereGeometry(naught_radius, 40, 40);
        //(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength)
        // And put the geometry and material together into a mesh
        var sphere = new THREE.Mesh(geometry, material);
        return sphere;
    };

    var getCross = function(pole_radius, naught_radius){
        var material = new THREE.MeshPhongMaterial( { color: 0x000000, specular: 0x666666, 
            emissive: 0xff0000, ambient: 0x000000, shininess: 10, shading: THREE.SmoothShading, 
            opacity: 1, transparent: false } );
        // Create a group and add above together
        var cross = new THREE.Object3D();
        var pole_1 = getCyclinder(material, pole_radius, naught_radius);
        var pole_2 = getCyclinder(material, pole_radius, naught_radius);
        pole_2.rotation.x = Math.PI/2;
        var pole_3 = getCyclinder(material, pole_radius, naught_radius);
        pole_3.rotation.z = Math.PI/2;
        cross.add(pole_1);
        cross.add(pole_2);
        cross.add(pole_3);
        cross.rotation.x = Math.PI/4;
        cross.rotation.y = Math.PI/4;
        cross.rotation.z = Math.PI/4;
        return cross;
    };
    this.getGrid = function(){
        return this.grid;
    };

    this.addCoin = function(coinType, position){
        var coin = null;
        if(coinType === "Naught"){
            coin = getNaught(this.naught_radius);
        }
        else{
            coin = getCross(2*this.pole_radius, 2*this.naught_radius);
        }
        var common_offset = 2*(this.naught_radius+this.pole_radius);
        coin.position.x = (position[0]-1)*common_offset;
        coin.position.y = (position[1]-1)*common_offset;
        coin.position.z = (position[2]-1)*common_offset;
        this.grid.add(coin);
        return coin;
    };
    this.removeCoin = function(coin){
        this.grid.remove(coin);
    };

	var createGrid = function(pole_radius, naught_radius){

        var material = new THREE.MeshPhongMaterial( { color: 0x000000, specular: 0x666666, 
            emissive: 0x0b0077, ambient: 0x000000, shininess: 10, shading: THREE.SmoothShading, 
            opacity: 1, transparent: false } );

        /* Calcualtion for grid
            radius of not[ball] = x
            radius of grid poles = y
            Cube dimension: 3*2*x+2*2*y
            grid pole offsets: 
                - 2*x, 2*2*x+2*y
            length of pole = 3*2*x+2*2*y
        */
        var pole_length = 2*2*pole_radius+3*2*naught_radius;
        var cylinder = [];
        // Create a group and add above together
        var group = new THREE.Object3D();
        var i,j,k;

        for(i=0;i<12;i++){
            cylinder[i] = getCyclinder(material, pole_radius, pole_length);
            if(i<4)  cylinder[i].rotation.x = Math.PI/2;
            else if (i<8) cylinder[i].rotation.z = Math.PI/2;
            //else cylinder[i].rotation.z = Math.PI/2;
            //cylinder[i].position.x = i*2*pole_radius;
            group.add(cylinder[i]);
        }
        for(j=0;j<2;j++){
            for(k=0;k<2;k++){
                cylinder[2*j+k].position.x =
                    (2*k-1)*naught_radius+pole_radius;
                cylinder[2*j+k].position.y =
                    (2*j-1)*naught_radius+pole_radius;
            }
        }
        for(j=0;j<2;j++){
            for(k=0;k<2;k++){
                cylinder[4+2*j+k].position.z =
                    (2*k-1)*naught_radius+pole_radius;
                cylinder[4+2*j+k].position.y =
                    (2*j-1)*naught_radius+pole_radius;
            }
        }
        for(j=0;j<2;j++){
            for(k=0;k<2;k++){
                cylinder[8+2*j+k].position.z =
                    (2*k-1)*naught_radius+pole_radius;
                cylinder[8+2*j+k].position.x =
                    (2*j-1)*naught_radius+pole_radius;
            }
        }
        // Adding a invisible box
        /* Since not using ray casting commented out
        for(var i=0;i<3;i++){
            for(var j=0;j<3;j++){
                for(var k=0;k<3;k++){
                    var cube_width = 2*naught_radius;
                    var geometry = new THREE.CubeGeometry(cube_width, cube_width, cube_width, 1, 1, 1);
                    var inv_mat = new THREE.MeshPhongMaterial( {opacity: 0, transparent: true } );
                    var cube = new THREE.Mesh(geometry, inv_mat);
                    var common_offset = 2*(naught_radius+pole_radius);
                    cube.position.x = (i-1)*common_offset;
                    cube.position.y = (j-1)*common_offset;
                    cube.position.z = (k-1)*common_offset;
                    group.add(cube);
                }
            }
        } */
        // Add a axis helper to identify the orientation
        group.add(new THREE.AxisHelper(1));
        // trying iut text
        /* var textGeo = new THREE.TextGeometry( "Nitt", {

                    size: 0.2,
                    height: 0.2,
                    curveSegments: 4,

                    font: "optimer",
                    weight: "bold",
                    style:  "normal",

                    bevelThickness: 0.001,
                    bevelSize: 0.0015,
                    bevelEnabled: true,

                    material: 0,
                    extrudeMaterial: 1

        });
        var textMesh1 = new THREE.Mesh( textGeo, material );
        group.add(textMesh1); */
        return group;
	};
    this.init(0.1, 1);
});