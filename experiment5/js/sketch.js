// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file


// Globals


let canvasContainer;
var centerHorz, centerVert;


function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}


let shape,shape2;
let cam;
let x,y,z;
let startingComets = 100;
let cometArray = [];
let range = 500;
let drawTimer = 10;
let ticks = 0;
let locked = false;
let currentCometID;
let cometIndex = -1;
function Comet(vec, speed, mod,size,id,color){
  this.vec = vec;
  this.speed = speed;
  this.mod = mod;
  this.size = size;
  this.id = id;
  this.color = color;
}
function preload(){
}
function watch_comet(){
  locked = true;
  for (let comet of cometArray){
    if (comet.vec.x < 100){
      currentCometID = comet.id;
    }
  }
}
function mouseClicked(){
  cam.setPosition(500, 1000,1000);
  cam.lookAt(0, 0, 0);
  locked = false;
}
function keyPressed(){
  watch_comet();
}
function setup() {
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height(),WEBGL);
  canvas.parent("canvas-container");
  
  //debugMode();

  for (let i = 0; i < startingComets; i++){
    cometArray.push(new_comet());
  }

  cam = createCamera();
  
  
  
  setCamera(cam)
  
  cam.setPosition(500, 1000,1000);
  cam.lookAt(0, 0, 0);
}
function new_comet(){
  let rand = random(0,1);
  let mod = 0;
  let id = random(0,10);
  
  if (random >= 0.8){
    mod = -1;
  }
  else{
    mod = 1;
  }
  return new Comet(createVector(-800,0,random(-range,range)),rand * 10,mod,random(5,30),id,color(random(0,255),random(0,255),random(0,255)));
}
function draw_sphere_at(comet){
  let vec = comet.vec
  push();
  noStroke();
  fill(comet.color)
  translate(vec);//vec.x, vec.y, vec.z);
  sphere(comet.size);
  pop();
  
}
function draw() {
  ticks += 1;
  if (ticks >= drawTimer){
    cometArray.push(new_comet())
    ticks = 0;
  }
  lights();
  background(0);
  orbitControl();
  // Place the camera at the top-right.
  //cam.setPosition();
  //normalMaterial();
  
  for (let comet of cometArray){
    move_comet(comet);
    draw_sphere_at(comet);
  }
  if (locked){
    let temp = null;
    for (let comet of cometArray){
      if (comet.id == currentCometID){
        
        temp = comet.vec;
      }
    }
    if (temp == null){

      watch_comet();
      return;
    }
    //print(temp)
    cam.lookAt(temp.x,temp.y,temp.z);
    cam.setPosition(temp.x + 300,temp.y + 300, temp.z + 300)
  }
  // Draw the box.
}
function move_comet(comet){
  comet.vec.x += comet.speed;
  comet.speed += comet.mod * 0.005;
  //8000 cutoff
  if (comet.vec.x >= 800){
    let temp = []
    for (let comet of cometArray){
      if (comet.vec.x < 800){
        temp.push(comet);
      }
      cometArray = temp;
    }
  }

  //if (comet.speed <= 0){
    //comet.speed = 0.001;
  //}
}