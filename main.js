import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';

console.log(26)

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	  camera.position.z = 0;
let camera_group = new THREE.Group();
	camera_group.position.set(0,0,0);
	camera_group.add( camera );
	scene.add(camera_group);


const renderer = new THREE.WebGLRenderer();
renderer.xr.enabled = true;
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );
document.body.appendChild( VRButton.createButton( renderer ) );

function add_segment (p1,p2,direction) {
	const geometry = new THREE.BoxGeometry( 1, 1, 1 ); 
	const material = new THREE.MeshBasicMaterial( {color: 0x0000ff} );
		  material.wireframe = true;
	const cube = new THREE.Mesh( geometry, material ); 
	scene.add( cube );
}

var iter = 0; 
var p1_start = new THREE.Vector3(0,0,-1);
var p2_start = new THREE.Vector3(0,0,-3);
add_segment(p1_start, p2_start);
let direction = new THREE.Vector3(0,0,-2)
var p1 = p1_start.clone();
var p2 = p2_start.clone();
let p0 = p1.clone();
function animate() {
	if (renderer.xr.isPresenting) {
		if(iter%10==0) {
			// Add first segment
			p0 = p1.clone();
			p1 = p2.clone();
			let new_p2 = direction.clone();
			p2 = new_p2.add(p1);
			add_segment(p1,p2);
			// Add second segment
			p1 = p2.clone();
			new_p2 = direction.clone();
			p2 = new_p2.add(p1);
			add_segment(p1,p2);
			// Add third segment
			direction = new THREE.Vector3();
			renderer.xr.getCamera().getWorldDirection(direction);
			let local_direction = new THREE.Vector3();
			renderer.xr.getCamera().worldToLocal(local_direction)
		
			p1 = p2.clone();
			new_p2 = direction.clone();
			p2 = new_p2.add(p1);
			add_segment(p1,p2,local_direction);
		}
		
		let length = p0.distanceTo(camera_group.position);
		let delta  = length/10;
		let direction_position = new THREE.Vector3(0,0,0)
			direction_position.subVectors( p0, camera_group.position ).normalize();
		let new_position = camera_group.position;	
			new_position.add( direction_position.multiplyScalar( delta ) );
			camera_group.position.x = new_position.x;
			camera_group.position.y = new_position.y;
			camera_group.position.z = new_position.z;
	}
	renderer.render( scene, camera ); iter++; 
}
