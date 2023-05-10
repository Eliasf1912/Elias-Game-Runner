const container = document.getElementById('container');

import * as THREE from 'three';
import { Camera, CubeReflectionMapping } from 'three';

//La scéne
const scene = new THREE.Scene();

// background scene
const bg_loader = new THREE.TextureLoader();
bg_loader.load('./assets/bg-farcry.jpg', function(texture){
	scene.background = texture;
})

// Caméra 
const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 7;
camera.position.y = 7;
camera.rotation.set(-0.3, 0, 0);

// Rendu
const renderer = new THREE.WebGLRenderer();
// on lui donne la taille de l'écran
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

// -------------------- Perso -------------------- //
const geometry = new THREE.BoxGeometry(0.5, 1, 0.5);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);

// on l'ajoute à la scéne
scene.add(cube);

// on change la position du cube sur la scéne 
cube.position.z = -5.5;  
cube.position.x = 0;  
cube.position.y = 2;  

// -------------------- Parcel -------------------- //
const ParcelGeometry = new THREE.BoxGeometry(8, 2, 1000);
const ParcelMaterial = new THREE.MeshBasicMaterial({ color: 0xAFDEF6 });
const parcel = new THREE.Mesh(ParcelGeometry, ParcelMaterial);

// on change la position de la parcel sur la scéne
parcel.position.set(0,0,-8)

//on l'ajoute à la scéne
scene.add(parcel);

// -------------------- Pique -------------------- //
const piqueGeometry = new THREE.ConeGeometry(0.4,0.8,10);
const piqueMaterial = new THREE.MeshBasicMaterial({color: 0xffff00});
const pique = new THREE.Mesh(piqueGeometry,piqueMaterial);

// -------------------- Mur -------------------- //
const murGeometry = new THREE.PlaneGeometry( 1, 1 );
const murMaterial = new THREE.MeshBasicMaterial( {color: 0xfaaCf00, side: THREE.DoubleSide} )
const mur = new THREE.Mesh(piqueGeometry,piqueMaterial);


// tab pour les obstacles
const obstacles = [];

// crée des piques 
function wallObstacle(){
	generateobstacle(murGeometry,murMaterial,5,"Mur");
}

function picObstacle(){
	generateobstacle(piqueGeometry,piqueMaterial,2,"pique");
}


function generateobstacle(geometry,material,Posy,N){
	let NbPic = Math.floor((Math.random()*5) + 2);

	for(let p = 0; p < NbPic; p++){
		
		// console.log(Px);
		let Px = Math.floor((Math.random()*7 - 3));
		const obstacle = new THREE.Mesh(geometry, material);
		// change sa postion sur l'axe x
		obstacle.position.x = Px;
		obstacle.position.z = -40;
		obstacle.position.y = Posy;
		// je l'ajoute à la scéne
		scene.add(obstacle);
		// console.log("moi");
		obstacle.name = N;
		// console.log(obstacle.name)
		obstacles.push(obstacle);	
	}
}

// spawn des piques
setInterval(wallObstacle,3300);
setInterval(picObstacle,1500);

// variable pour le jump
let canJump = true;
let jump_up = "up";
let gravity = 1;
let triggerJump = false;

// function jump
function jump(){
	
	if(jump_up === "up"){
		if(cube.position.y <= 5){
			cube.position.y +=0.1;
		}
		else{
			jump_up = "down";
		}
	}
	else if( jump_up === "down" ){
		if(cube.position.y >= 2){
			cube.position.y-=0.1;
		}
		else{
			jump_up = "up";
			triggerJump = false;
		}
	}
}

// btn restart
const btnRestart = document.getElementById("fin");

// function pour bouger le cube(joueurs)
function MovePlayer(){
	document.addEventListener('keydown', (event)=>{
		if ((event.key ==='ArrowLeft') || (event.key==='ArrowRight') || (event.key==='ArrowDown') || (event.key==='ArrowUp')){
			switch(event.key){
			   
				case 'ArrowUp':
					if(!triggerJump){
						triggerJump = true;
					}
					break;
				
				case 'ArrowDown':
					if(cube.position.y >= 2){
						cube.position.y = 2;
						console.log(cube.position.y)
					}
					break;
				
				case 'ArrowLeft':
					if(cube.position.x >= -3){
						cube.position.x -= 0.002;
						console.log(cube.position.x)
					}
					break;
				
				case 'ArrowRight':
					if(cube.position.x <= 3){
						cube.position.x += 0.002;
						console.log(cube.position.x);
					}
					break;    
				
			}
		}
		

	});
}

// function pour détecter les colllisions 
let hit; 
let IsAnime = true;
function colisionCheck(){
	hit = false;
	for( let c = 0; c < obstacles.length; c++){
		if( obstacles[c].name === "pique"){
			if((cube.position.x + cube.geometry.parameters.width > obstacles[c].position.x) && (cube.position.x - cube.geometry.parameters.width < obstacles[c].position.x)){
				if((cube.position.y + cube.geometry.parameters.width > obstacles[c].position.y) && (cube.position.y - cube.geometry.parameters.width < obstacles[c].position.y)){
					if((obstacles[c].position.z > (cube.position.z - 0.1)) && (obstacles[c].position.z < (cube.position.z + .1))){
						hit = true;
						IsAnime = false;
						console.log(hit);
						cancelAnimationFrame(requestId);
						btnRestart.style.display = "flex";
					}
				}
			}
		}
		else{
			if((cube.position.x + cube.geometry.parameters.width > obstacles[c].position.x) && (cube.position.x - cube.geometry.parameters.width < obstacles[c].position.x)){
				if((cube.position.y + cube.geometry.parameters.width > obstacles[c].position.y) && (cube.position.y - cube.geometry.parameters.width < obstacles[c].position.y)){
					if((obstacles[c].position.z > (cube.position.z - 0.1)) && (obstacles[c].position.z < (cube.position.z + .1))){
						hit = true;
						IsAnime = false;
						console.log(hit);
						cancelAnimationFrame(requestId);
						btnRestart.style.display = "flex";
					}
				}
			}
		}
		
	}
}

// restart the game 
btnRestart.addEventListener("click", function(e){
	// e.preventDefault();
	window.location.href = "index.html";
	btnRestart.style.display = "none"
})

// score

const SS = document.getElementById('score');

let score = 0;
function scoreUp(){
	if(IsAnime = true){
		score += 5;
		SS.innerText = score;
	}
}

let requestId;


// console.log(camera);
// console.log(scene);
console.log(cube);
// console.log(container);
// console.log(camera.position);
// console.log(ParcelMaterial);

function animate(){
	requestId = requestAnimationFrame(animate);
	renderer.render(scene,camera);

	// test
	cube.rotation.y += 0.01;

	for(let i =0; i<obstacles.length; i++){
		// défilement des piques
		obstacles[i].position.z += 0.1;
		// suppresion des pics
		if(obstacles[i].position.z > camera.position.z){
			// console.log(obstacles[i].uuid);
			obstacles.shift();
		}
	};

	// move player
	MovePlayer();

	if(triggerJump){
		jump();
	}

	// colision
 	colisionCheck()

	//score
	scoreUp();

}
animate();
