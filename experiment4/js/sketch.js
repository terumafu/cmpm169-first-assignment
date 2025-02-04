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

var img;
var timePassed = 0;
var mouseXFactor;
var mouseYFactor
var posX;
var posY;
var tileWidth;///width / img.width;
var tileHeight = 2;//height / img.height;
var mult = 2;

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

function preload() {
  img = loadImage('./assets/Cavendish.png');
  backImg = loadImage('./assets/Plasma_Deck.png')
  img.loadPixels();
  backImg.loadPixels;
}

// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized
  mouseXFactor = 0.13 * 2
  mouseYFactor = 0.1 * 2
 
}
// draw() function is called repeatedly, it's the main animation loop
function draw() {
  timePassed = timePassed + deltaTime;
  background(255);
  tileWidth = cos(timePassed/1000) * mult;
  for (var gridX = 0; gridX < img.width; gridX += 2) {
    for (var gridY = 0; gridY < img.height; gridY += 2) {
      
      
      posX = tileWidth * gridX - img.width * tileWidth/2 + img.width * mult;
      posY = tileHeight * gridY;

      // get current color
      var c;
      if (tileWidth < 0){
        c = color(backImg.get(gridX, gridY));
      }
      else{
        c = color(img.get(gridX, gridY));
      }
      
      // greyscale conversion
      var greyscale = round(red(c) * 0.222 + green(c) * 0.707 + blue(c) * 0.071);

      // pixel color to fill, greyscale to ellipse size
      var w6 = map(greyscale, 0, 255, 25, 0);
      noStroke();
      fill(c);
      ellipse(posX, posY, w6 * mouseXFactor * tileWidth, w6 * mouseYFactor * tileHeight);
        
      
      
    }
  }
}

