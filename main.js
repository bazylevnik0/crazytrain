import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

function add_segment (p1,p2) {
	let points = [];
	// Far reactangle
	points.push( new THREE.Vector3( -2+p2.x,  1+p2.y, 0+p2.z ) ); // l u
	points.push( new THREE.Vector3(  2+p2.x,  1+p2.y, 0+p2.z ) ); // r u
	points.push( new THREE.Vector3(  2+p2.x, -1+p2.y, 0+p2.z ) ); // r d
	points.push( new THREE.Vector3( -2+p2.x, -1+p2.y, 0+p2.z ) ); // l d
	points.push( new THREE.Vector3( -2+p2.x,  1+p2.y, 0+p2.z ) );
	// Second part ( nearest rectangle and connection with first)
	points.push( new THREE.Vector3( -2+p1.x,  1+p1.y, 0+p1.z ) ); // l u
	points.push( new THREE.Vector3(  2+p1.x,  1+p1.y, 0+p1.z ) ); // r u
	points.push( new THREE.Vector3(  2+p2.x,  1+p2.y, 0+p2.z ) );
	points.push( new THREE.Vector3(  2+p1.x,  1+p1.y, 0+p1.z ) );
	points.push( new THREE.Vector3(  2+p1.x, -1+p1.y, 0+p1.z ) ); // r d
	points.push( new THREE.Vector3(  2+p2.x, -1+p2.y, 0+p2.z ) );
	points.push( new THREE.Vector3(  2+p1.x, -1+p1.y, 0+p1.z ) );
	points.push( new THREE.Vector3( -2+p1.x, -1+p1.y, 0+p1.z ) ); // l d
	points.push( new THREE.Vector3( -2+p2.x, -1+p2.y, 0+p2.z ) );
	points.push( new THREE.Vector3( -2+p1.x, -1+p1.y, 0+p1.z ) );
	points.push( new THREE.Vector3( -2+p1.x,  1+p1.y, 0+p1.z ) );

	let geometry = new THREE.BufferGeometry().setFromPoints( points );

	var segment = new THREE.Line(geometry, new THREE.LineBasicMaterial({
		color: 0x0000ff,
		linewidth: 1,
	}));
	segment.computeLineDistances();

	scene.add( segment );
}
add_segment(new THREE.Vector3(0,0,-1),new THREE.Vector3(0,0,-3));


camera.position.z = 1;

function animate() {

	renderer.render( scene, camera );

}