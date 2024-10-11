import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );


const points = [];
points.push( new THREE.Vector3( 0, 0, 0 ) );
points.push( new THREE.Vector3( 1, 1, 0 ) );

var geometry = new THREE.BufferGeometry().setFromPoints( points );

var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({
    color: 0x0000ff,
    linewidth: 200,
}));
line.computeLineDistances();

scene.add( line );

camera.position.z = 5;

function animate() {

	renderer.render( scene, camera );

}