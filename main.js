import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';

console.log(38)

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	  camera.position.z = 0;
let camera_group = new THREE.Group();
	camera_group.position.x = 0;
	camera_group.position.y = 0;
	camera_group.position.z = 0;
	camera_group.add( camera );
	scene.add(camera_group);

const renderer = new THREE.WebGLRenderer();
renderer.xr.enabled = true;
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );
document.body.appendChild( VRButton.createButton( renderer ) );

function add_segment (position, rotation) {
	const geometry = new THREE.BoxGeometry( 2, 1, 1 ); 
	const material = new THREE.MeshBasicMaterial( {color: 0x0000ff} );
		  material.wireframe = true;
	const edges = new THREE.EdgesGeometry( geometry ); 
	const line  = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xffffff } ) ); 
		  line.position.x = position.x;
		  line.position.y = position.y;
		  line.position.z = position.z;
		  line.geometry.lookAt( rotation);
	scene.add( line );
}

let position_path = camera_group.position.clone(); 
let position_new = position_path.clone();
let i = 0; let length = position_path.distanceTo(position_new); let delta  = length/10;
	
function animate() {
	//if (renderer.xr.isPresenting) {
	let position_old = camera_group.position.clone();
	
	if (i%10==0) {
		let direction_rotation = new THREE.Vector3();
			renderer.xr.getCamera().getWorldDirection(direction_rotation);
		for (let j = 0; j < 10; j++) {
			let direction_position = position_path.clone();	
			direction_position.add ( direction_rotation.multiplyScalar( 0.1 ) );
			position_path = direction_position.clone();		
			position_new  = position_path.clone();
	
			add_segment(position_path, direction_rotation);
		}
		length = position_old.distanceTo(position_new);
		delta  = length/10;
	} 
	
	let position_move = new THREE.Vector3(0,0,0)
		position_move.subVectors( position_old, position_new ).normalize().negate();
	let position_current = camera_group.position.clone();	
		position_current.add( position_move.multiplyScalar( delta ) );
		camera_group.position.x = position_current.x;		
		camera_group.position.y = position_current.y;		
		camera_group.position.z = position_current.z;		
	//}	
	renderer.render( scene, camera ); i++;
}
