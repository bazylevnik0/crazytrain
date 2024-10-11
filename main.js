import * as THREE from 'three';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const points = [];
points.push( new THREE.Vector3( 0, 0, 0 ) );
points.push( new THREE.Vector3( 1, 1, 0 ) );

let positions = [];
let colors    = [];
for (let i = 0; i < points.length; i++) {
	let point = points[i];
	positions.push(point.x, point.y, point.z);
	let color = new THREE.Color( 1, 0, 0 );
	colors.push(color.r, color.g, color.b);
}

const geometry = new LineGeometry();
    geometry.setPositions( positions );
	geometry.setColors( colors );

let material = new LineMaterial( {
	color: 0xffffff,
	linewidth: 50, 
	vertexColors: true,
	dashed: false,
} );

let line = new Line2( geometry, material );
	line.computeLineDistances();
	line.scale.set( 1, 1, 1 );
	scene.add( line );

camera.position.z = 5;

function animate() {
	renderer.render( scene, camera );
}