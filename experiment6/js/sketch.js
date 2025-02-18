// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file


// Globals


let canvasContainer;
let centerHorz, centerVert;

let modules;

let tileSize = 30;
let gridResolutionX;
let gridResolutionY;
let tiles = [];

let doDrawGrid = true;
let isDebugMode = false;

let factories = [];
let factoryDict = {};
let letters = [];
let currentDescription = null;
let maxletters = 20;

function Factory(input, output, location){
  this.input = input;
  this.output = output;
  this.location = location;
}
function Letter(location,letter,speed,color){
  this.location = location.copy();
  this.letter = letter;
  this.speed = speed;
  this.color = color;
}

function find_factory(char){
  for (let factory of factories){
    if (factory.input == char){
      return factory;
    }
  }
}

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}



function preload() {
  // load SVG modules
  modules = [];

  // METHOD 1: Looping through local files is efficient
  for (let i = 0; i < 16; i++) {
  modules[i] = loadImage('./assets/' + nf(i, 2) + '.svg');
  }

}

function setup() {
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  
  cursor(CROSS);
  rectMode(CENTER);
  imageMode(CENTER);
  strokeWeight(0.15);
  textSize(8);
  textAlign(CENTER, CENTER);

  gridResolutionX = round(width / tileSize) + 2;
  gridResolutionY = round(height / tileSize) + 2;

  initTiles();

  factories.push(new Factory("A","DE",createVector(5,5))); 
  factories.push(new Factory("B","EF",createVector(5,10))); 
  factories.push(new Factory("C","FG",createVector(5,15))); 

  factories.push(new Factory("D","C",createVector(15,3))); 
  factories.push(new Factory("E","A",createVector(20,10))); 
  factories.push(new Factory("F","A",createVector(20,15))); 
  factories.push(new Factory("G","F",createVector(15,20))); 
  
  spawn_letter(factories[0],"D")
  spawn_letter(factories[1],"E")
  print(letters)
  init_factory_dict()
  connect_factories()
}

function init_factory_dict(){
  for (let factory of factories){
    factoryDict[factory.input] = factory.location;
  }
}
function initTiles() {
  for (var gridX = 0; gridX < gridResolutionX; gridX++) {
    tiles[gridX] = [];
    for (var gridY = 0; gridY < gridResolutionY; gridY++) {
      tiles[gridX][gridY] = 0;
    }
  }
}
function connect_factories(){
  for (let factory of factories){
    for (let char of factory.output){
      draw_line(factory.location.x,factory.location.y,factoryDict[char].x, factoryDict[char].y)
    }
  }
}
function spawn_letter(factory,letter){
  letters.push(new Letter(factory.location,letter,random(1,1.5),color(random(0,255),random(0,255),random(0,255))));
}
/**
 * draw tool. draws a specific module according to
 * its east, south, west and north neighbours.
 *
 * MOUSE
 * drag left           : draw new module
 * drag right          : delete a module
 *
 * KEYS
 * del, backspace      : clear screen
 * g                   : toggle show grid
 * d                   : toggle show module values
 * s                   : save png
 */


function setTile() {
  // convert mouse position to grid coordinates
  var gridX = floor(mouseX / tileSize) + 1;
  gridX = constrain(gridX, 1, gridResolutionX - 2);
  var gridY = floor(mouseY / tileSize) + 1;
  gridY = constrain(gridY, 1, gridResolutionY - 2);
  tiles[gridX][gridY] = 1;
}
function set_tile_at(x,y){
  var gridX = x;
  gridX = constrain(gridX, 1, gridResolutionX - 2);
  var gridY = y;
  gridY = constrain(gridY, 1, gridResolutionY - 2);
  tiles[gridX][gridY] = 1;
}

function draw_line(x,y,x2,y2){
  let x1 = x;
  let y1 = y ;
  let dx = (x2 - x1) / Math.abs(x2 - x1);
  let dy = (y2 - y1) / Math.abs(y2 - y1)
  while(x1 != x2){
    x1 += dx;
    set_tile_at(x1,y1);
  }

  while (y1 != y2){
    y1 += dy;
    set_tile_at(x1,y1);
  }
}
function unsetTile() {
  var gridX = floor(mouseX / tileSize) + 1;
  gridX = constrain(gridX, 1, gridResolutionX - 2);
  var gridY = floor(mouseY / tileSize) + 1;
  gridY = constrain(gridY, 1, gridResolutionY - 2);
  tiles[gridX][gridY] = 0;
}

function draw() {
  //background(100);
  /*
  if (mouseIsPressed) {
    if (mouseButton == LEFT) setTile();
    if (mouseButton == RIGHT) unsetTile();
  }
  */
  
  if (doDrawGrid) drawGrid();
  drawModules();
  draw_factories();
  if (currentDescription != null){
    draw_description();
  }
  
  move_and_draw_letters();
  

}

function drawGrid() {
  stroke("black")
  strokeWeight(0.15)
  for (var gridX = 0; gridX < gridResolutionX; gridX++) {
    for (var gridY = 0; gridY < gridResolutionY; gridY++) {
      var posX = tileSize * gridX - tileSize / 2;
      var posY = tileSize * gridY - tileSize / 2;
      fill(100);
      if (isDebugMode) {
        if (tiles[gridX][gridY] == 1) fill(220);
      }
      rect(posX, posY, tileSize, tileSize);
    }
  }
}

function drawModules() {
  stroke("black")
  for (var gridX = 0; gridX < gridResolutionX - 1; gridX++) {
    for (var gridY = 0; gridY < gridResolutionY - 1; gridY++) {
      // use only active tiles
      if (tiles[gridX][gridY] == 1) {
        // check the four neightbours, each can be true or false
        var NORTH = str(tiles[gridX][gridY - 1]);
        var WEST = str(tiles[gridX - 1][gridY]);
        var SOUTH = str(tiles[gridX][gridY + 1]);
        var EAST = str(tiles[gridX + 1][gridY]);

        // create binary result out of it
        var binaryResult = NORTH + WEST + SOUTH + EAST;

        // convert binary string to a decimal value from 0 - 15
        var decimalResult = parseInt(binaryResult, 2);

        var posX = tileSize * gridX - tileSize / 2;
        var posY = tileSize * gridY - tileSize / 2;

        // decimalResult is also the index for the shape array
        image(modules[decimalResult], posX, posY, tileSize, tileSize);

        if (isDebugMode) {
          fill(150);
          text(decimalResult + '\n' + binaryResult, posX, posY);
        }
      }
    }
  }
}

function draw_factories(){
  
  for (let factory of factories){
    draw_factory(factory.location.x,factory.location.y);
  }
}
function draw_factory(x,y){
  //noFill();
  stroke("black")
  strokeWeight(5)
  circle(x * tileSize - tileSize/2,y * tileSize - tileSize/2,30)
}

function draw_description(){
  
  let x = currentDescription.location.x * tileSize;
  let y = currentDescription.location.y * tileSize;
  rect(x - tileSize/2,y - 75,120, 50);
  stroke("black")
  fill("black")
  strokeWeight(2)
  textSize(25)
  text(currentDescription.input + " -> " + currentDescription.output,x - tileSize/2,y - 75)
  
}

function move_and_draw_letters(){
  for (let letter of letters){
    stroke("white")
    fill(letter.color)
    strokeWeight(2)
    textSize(25)
    let destination = factoryDict[letter.letter];
    let x1 = letter.location.x;
    let y1 = letter.location.y; 
    let dx = (destination.x - x1) / Math.abs(destination.x - x1) * 0.1 * letter.speed;
    let dy = (destination.y - y1) / Math.abs(destination.y - y1) * 0.1 * letter.speed;
    
    if(Math.abs(x1 - destination.x) >= 0.1){
      letter.location.x += dx;
      text(letter.letter, letter.location.x * tileSize,letter.location.y * tileSize - tileSize/2);
      continue;
    }
  
    if (Math.abs(y1 - destination.y) >= 0.1){
      letter.location.y += dy;
      text(letter.letter, letter.location.x * tileSize,letter.location.y * tileSize - tileSize/2);
      continue;
    }
    let factory = find_factory(letter.letter);
    if (letters.length >= maxletters){
      let rand = Math.floor(random(0,factory.output.length));
      letter.letter = factory.output[rand];
      
    }
    else{
      letter.letter = factory.output[0];
      if (factory.output.length > 1){
        letters.push(new Letter(destination.copy(), factory.output[1],random(1,1.5),color(random(0,255),random(0,255),random(0,255))))
      }
    }
    letter.color = color(random(0,255),random(0,255),random(0,255));
  }
  
}

function keyPressed() {
  if (key == 's' || key == 'S') saveCanvas(gd.timestamp(), 'png');

  if (keyCode == DELETE || keyCode == BACKSPACE) initTiles();
  if (key == 'g' || key == 'G') doDrawGrid = !doDrawGrid;
  if (key == 'd' || key == 'D') isDebugMode = !isDebugMode;
}

function mouseMoved(){
  if (is_mouse_over_factory() != null){
    currentDescription = is_mouse_over_factory();
  }
  else{
    currentDescription = null;
  }
}

function is_mouse_over_factory(){
  for (let factory of factories){
    let x = factory.location.x * tileSize;
    let y = factory.location.y * tileSize;
  if (mouseX > x - tileSize && mouseX < x){
    if (mouseY > y - tileSize && mouseY < y){
      //circle(x - tileSize/2,y - tileSize/2,20)
      return factory;
    }
  }
}
  return null;
}