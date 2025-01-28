// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file


// Globals

let myInstance;
let canvasContainer;
var centerHorz, centerVert;
let bug, worm, egg;

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized

  angleMode(DEGREES);
  noFill();
  
  
  bug = new Bug(100,100,5);
  worm = new Worm(0,0,5,20,0);
  worm.create_worm();
  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();
  background(100);
 
}
let timer = 0;
let eggtimer = 0;
let timepassed = 0;
// draw() function is called repeatedly, it's the main animation loop
function draw() {
  
  if (true){
    timer += deltaTime
    if (timer >= 1000){
      if (worm != null){
        worm.grow();
        timer = 0;
        print(worm.get_age())
        
        if (worm.get_age() >= 35){
          egg = new Egg(worm.get_x_y()[0],worm.get_x_y()[1]);
          worm = null;
        }
      }
      if (egg != null){
        eggtimer += 1;
        print("egg tick")
        if (eggtimer >= 5){
          worm = egg.hatch_worm();
          eggtimer = 0;
          egg = null;
        }
        timer = 0;
      }
    }
    //background(100)
    strokeWeight(10)
    //point(bug.x,bug.y);
    strokeWeight(2)
    bug.run(20,canvasContainer.width() - 20, canvasContainer.height() - 20);
    if (worm != null){
      //print(worm.nodeArr)
      worm.follow(bug.x,bug.y)
      //worm.follow(mouseX,mouseY)
      //print(worm.nodeArr)
      worm.draw_circles(true)
      worm.draw_curve(360 * sin(timepassed/1000));
    }
    if (egg != null){
      strokeWeight(5)
      egg.draw_egg();
    }
    else{
      timepassed += deltaTime;
    }

    
  }
}

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
  //worm.grow()
    // code to run when mouse is pressed
    if (false){
  let lastnode = nodeArr[nodeArr.length-1];
  let temp =new Node(lastnode.x,lastnode.y,10,null,lastnode.direction);
  print(lastnode.x)
  nodeArr[nodeArr.length-1].setNextNode(temp);
  nodeArr.push(temp);
    }
}