import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	  camera.position.z = 0;
let camera_group = new THREE.Group();
	camera_group.position.x = 0;
	camera_group.position.y = 0;
	camera_group.position.z = 0;
	camera_group.add( camera );
	scene.add( camera_group );
	
	const light = new THREE.AmbientLight( 0x404040 ); // soft white light
		  light.intensity = 5; 	
	scene.add( light );
	
const renderer = new THREE.WebGLRenderer();
renderer.xr.enabled = true;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let loader = new GLTFLoader();
let model;
let plane;
new RGBELoader()
	.load( 'back.hdr', function ( texture ) {

		texture.mapping = THREE.EquirectangularReflectionMapping;

		scene.background = texture;
		scene.environment = texture;
		
		let texture_grass = new THREE.TextureLoader().load( "grass.png" );
		texture_grass.wrapS = THREE.RepeatWrapping;
		texture_grass.wrapT = THREE.RepeatWrapping;
		texture_grass.repeat.set( 10, 10 );
		
		const geometry = new THREE.PlaneGeometry( 10000, 10000 );
		const material = new THREE.MeshBasicMaterial( {color: 0x00ff00, side: THREE.DoubleSide, map: texture_grass} );
		plane = new THREE.Mesh( geometry, material );
		plane.position.y = -5;
		plane.rotation.x = Math.PI/2
		scene.add( plane );

		loader.load( 'rail.glb', (gltf)=> {
			model = gltf.scene;
			renderer.setAnimationLoop( animate );
			document.body.appendChild( VRButton.createButton( renderer ) );
		})			
	});

let segments = [];
function add_segment (position, rotation) {
	const segment = model.clone();
		  segment.position.x = position.x;
		  segment.position.y = position.y;
		  segment.position.z = position.z;
		  
		  segment.rotation.x = rotation.x;
		  segment.rotation.y = rotation.y;
		  segment.rotation.z = rotation.z;
		  
		  scene.add( segment ); 
		  segments.push(segment);
}

let position_path = camera_group.position.clone(); 
let position_new  = position_path.clone();
let i = 0; let length = position_path.distanceTo( position_new ); let delta = length/10;
	
let direction_rotation = new THREE.Vector3();
let direction_position = new THREE.Vector3();

function animate() {
		let position_old = camera_group.position.clone();
		// Each 10s frame add new segments
		if ( i%10 == 0 ) {
			for ( let j = 0; j < 5; j++ ) {
				if ( j == 4 ) {
					direction_rotation = new THREE.Vector3();
					renderer.xr.getCamera().getWorldDirection( direction_rotation );
				} 
				direction_position = position_path.clone();	
				direction_position.add ( direction_rotation );
				position_path = direction_position.clone();		
				position_new  = position_path.clone();	
				
				add_segment(position_path, renderer.xr.getCamera().rotation)
			}
			length = position_old.distanceTo( position_new );
			delta  = length / 10;
		} 
		// Move camera
		let position_move = new THREE.Vector3( 0, 0, 0);
			position_move.subVectors( position_old, position_new ).normalize().negate();
		let position_current = camera_group.position.clone();	
			position_current.add( position_move.multiplyScalar( delta ) );
			camera_group.position.x = position_current.x;		
			camera_group.position.y = position_current.y+0.25;		
			camera_group.position.z = position_current.z+0.5;		
			
			if (camera_group.position.y < 2) plane.position.y = camera_group.position.y - 3; 
		
	renderer.render( scene, camera ); i++;
	
	if (segments.length > 5000) scene.remove(segments.shift());
}
