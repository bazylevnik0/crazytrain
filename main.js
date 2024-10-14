import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

console.log(69)

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	  camera.position.z = 0;
let camera_group = new THREE.Group();
	camera_group.position.x = 0;
	camera_group.position.y = 0;
	camera_group.position.z = 0;
	camera_group.add( camera );
	
	const light = new THREE.AmbientLight( 0x404040 ); // soft white light
		  light.intensity = 5; 	
scene.add( light );
	scene.add(camera_group);

const renderer = new THREE.WebGLRenderer();
renderer.xr.enabled = true;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let loader = new GLTFLoader();
let model;
loader.load( 'rail++.glb', (gltf)=> {
	model = gltf.scene;
	renderer.setAnimationLoop( animate );
	document.body.appendChild( VRButton.createButton( renderer ) );
})			

function add_segment (position, rotation) {
	const geometry = new THREE.BoxGeometry( 2, 1, 1 ); 
	const material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
	const cube = new THREE.Mesh( geometry, material );
	//const cube = model.clone();
		  cube.position.x = position.x;
		  cube.position.y = position.y;
		  cube.position.z = position.z;
		  //cube.rotation.x = rotation.x;
		  //cube.rotation.y = rotation.y;
		  //cube.rotation.z = rotation.z;
		  cube.geometry.lookAt( rotation);
	scene.add( cube ); 
}

let position_path = camera_group.position.clone(); 
let position_new  = position_path.clone();
let i = 0; let length = position_path.distanceTo(position_new); let delta = length/10;
	
let direction_rotation = new THREE.Vector3();
let direction_position = new THREE.Vector3();

function animate() {
	//if (renderer.xr.isPresenting) {
	let position_old = camera_group.position.clone();
	
	if ( i%10 == 0 ) {
		for ( let j = 0; j < 5; j++ ) {
			if ( j == 4 ) {
				direction_rotation = new THREE.Vector3();
				renderer.xr.getCamera().getWorldDirection(direction_rotation);
			} 
			direction_position = position_path.clone();	
			direction_position.add ( direction_rotation );
			position_path = direction_position.clone();		
			position_new  = position_path.clone();	
			add_segment( position_path, direction_rotation );
		}
		length = position_old.distanceTo( position_new );
		delta  = length / 10;
	} 
	
	let position_move = new THREE.Vector3( 0, 0, 0);
		position_move.subVectors( position_old, position_new ).normalize().negate();
	let position_current = camera_group.position.clone();	
		position_current.add( position_move.multiplyScalar( delta ) );
		camera_group.position.x = position_current.x;		
		camera_group.position.y = position_current.y;		
		camera_group.position.z = position_current.z;		
	//}	
	renderer.render( scene, camera ); i++;
}
