// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;
let i = 0;
let time = 0;
let lineArr = [];
let completedArr = [];
let roundCubes = [
  {
  'kit': [1,0,1,1,1,1,2],
  'imd':[2,0,2,2,2,1,0],
  'yen':[3,2,3,2,0,2,1],
  'eni':[6,2,1,1,0,0,5]
  },
  {
  'kit':[1,0,3,2,0,0,2],
  'imd':[3,3,3,4,4,2,1],
  'yen':[6,3,4,2,0,2,1],
  'eni':[13,6,1,1,0,0,5],
  },{
  'kit':[2,2,8,2,2,3,2],
  'imd':[4,3,4,5,4,2,1],
  'yen':[6,5,8,2,3,4,1],
  'eni':[14,7,2,5,1,1,6]
  },{
  'kit':[7,4,10,5,2,5,2],
  'imd':[4,4,4,6,5,2,1],
  'yen':[9,5,9,5,5,4,2],
  'eni':[18,6,11,12,4,8,7]
  },{
  'kit':[16,6,10,10,2,6,3],
  'imd':[6,6,4,9,7,2,2],
  'yen':[9,6,12,6,7,7,2],
  'eni':[8,17,25,7,7,16,8]
  },{
    'kit':[13,7,14,7,1,1,3],
  'imd':[7,7,4,3,3,2,2],
  'yen':[10,8,4,4,2,2,3],
  'eni':[7,9,9,16,2,1,2]
}

]
class factionClass{
  constructor(x,y,weight,name,uiY,inv){
    this.x = x;
    this.y = y;
    this.weight = weight
    this.inventoryDict = {
      'white': inv[0],
      'green': inv[1],
      'brown': inv[2],
      'blue': inv[3],
      'yellow': inv[4],
      'black': inv[5],
      'orange': inv[6]
    };
    this.color = name;
    this.uiY = uiY;
  }
  drawfaction(){
    call_stroke(this.color);
    strokeWeight(this.weight);
    point(this.x,this.y);
  }
  draw_faction_inventory(){
    let step = 0;
    strokeWeight(10);
    call_stroke(this.color);
    point(800,this.uiY)
    for (const key in this.inventoryDict){
      for (let i = 0; i < this.inventoryDict[key]; i++){
        strokeWeight(5);
        call_stroke(key);
        point(900 + i * 10, step * 10 + this.uiY);
      }
      step += 1
    }
  }
}

let factiondict = {
  "eni": new factionClass(100,100,50,'eni',150,[2,1,2,1,0,0,0]),
  "kit": new factionClass(750,100,50,'kit',250,[2,3,3,1,1,1,1]),
  "imd": new factionClass(750,500,50,'imd',350,[2,2,3,1,1,1,1]),
  "yen": new factionClass(100,500,50,'yen',450,[1,1,1,1,2,1,1]),
  "eat": new factionClass(0,0,0,'eat',50,[0,0,0,0,0,0,0])
}

let colordict = {
  'white': 1,
  'green': 2,
  'brown': 3,
  'blue': 4,
  'yellow': 5,
  'black': 6,
  'orange': 7
}
let colorrgbdict = {
  'white': [255,255,255],
  'green': [0, 176, 6],
  'brown': [138, 70, 3],
  'blue': [0, 125, 235],
  'yellow': [250, 220, 50],
  'black': [0,0,0],
  'orange': [255, 187, 69],
  'imd':[3,186,252],
  'eni':[3,94,252],
  'yen':[140,0,255],
  'kit':[252,144,3],
  'eat':[0,0,0]
}
let roundlength = [];
let myData
function preload(){
  myData = loadStrings('../experiment1/assets/data2.txt')
  //dont run code in this function
}


class lineClass {
    constructor(origin, numcubes, color, recipient) {
        this.origin = origin;
        this.numcubes = numcubes;
        this.colorcube = color;
        this.recipient = recipient;

        //initialize random seed
        this.seed = numcubes;

        this.multx = 5;
        this.multy = -1;
        this.xoffset = random([-1,1]) * 100 * this.multx + 10 * colordict[color]; 
        let temp = factiondict[this.recipient]
        let vector2 = createVector(temp.x,temp.y);
        angleMode(DEGREES);
        this.xvector = createVector(this.xoffset,0);
        if(vector2.angleBetween(this.xvector) < 0){
          this.xvector.rotate(-(90 + vector2.angleBetween(this.xvector)));
        }
        else{
          this.xvector.rotate(90 - vector2.angleBetween(this.xvector));
        }
        
        this.randneg = random([-1,1]);
        this.animationInProgress = true;
        this.step = 0;
        this.sections = 50;
        this.weight = numcubes * 1 + 0.5;
        print(this.weight)
    }

    //called to instantly draw the line
    draw() {
      if (this.recipient == 'eat'){
        return;
      }
      //declare pseudorandom seed
      //randomSeed(this.seed);
      let x1 = factiondict[this.origin].x;
      let y1 = factiondict[this.origin].y;
      let x2 = factiondict[this.recipient].x;
      let y2 = factiondict[this.recipient].y;

      let vector1 = createVector(x1,y1);
      let vector2 = createVector(x2,y2);
      vector2.add(-x1,-y1);

      let x0 = x1 + this.xvector.x;
      let y0 = y1 - 100 * this.multy + this.xvector.y * this.randneg;
      
      let x3 = x2 + this.xvector.x;
      let y3 = y2 + 100 * this.multy + this.xvector.y * this.randneg;
      strokeWeight(this.weight);
      call_stroke(this.colorcube);
      curve(x0,y0,x1,y1,x2,y2,x3,y3);
    }

    animateStep(){
      if (this.recipient == 'eat'){
        this.step = this.sections;
        this.animationInProgress = false;
        factiondict[this.recipient].inventoryDict[this.colorcube] += int(this.numcubes);
        factiondict[this.origin].inventoryDict[this.colorcube] -= int(this.numcubes);
        reset_board();
        return;
      }
      if (this.step >= this.sections){
        this.animationInProgress = false;
        this.draw();
        completedArr.push(this);
        print(this.numcubes);
        if (factiondict[this.origin].inventoryDict[this.colorcube] > 0){
          factiondict[this.origin].inventoryDict[this.colorcube] -= int(this.numcubes);
        }
        factiondict[this.recipient].inventoryDict[this.colorcube] += int(this.numcubes);
        
        reset_board();

        //adds the resource to the faction inventory
        return;
      }
      let origin = factiondict[this.origin];
      let recipient = factiondict[this.recipient];
      let x = curvePoint(origin.x + this.xvector.x,origin.x, recipient.x, recipient.x + this.xvector.x, this.step/this.sections);
      let y = curvePoint(origin.y - 100 * this.multy + this.xvector.y * this.randneg,origin.y, recipient.y, recipient.y + 100 * this.multy + this.xvector.y * this.randneg, this.step/this.sections);
      call_stroke(this.colorcube);
      strokeWeight(5);
      point(x,y)
      this.step += 1;
    }
}
function call_stroke(color){
  let temp = colorrgbdict[color];
  stroke(temp[0],temp[1],temp[2]);
}
function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}


// setup() function is called once when the program starts
function setup() {
  randomSeed(100)
  let num = 0;
  for(let i = 0; i < myData.length; i++){
    let temparr = split(myData[i].toLowerCase(),' ');
    print(temparr)
    if (temparr[0] == ''){
      print("wahoo")
      roundlength.push(num);
      num = 0;
      continue;
    }
    num += 1;
    let temp = new lineClass(temparr[0],temparr[1],temparr[2],temparr[3]);
    lineArr.push(temp);
  }
  
  print(myData.length);
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();

  
  reset_board();
  
}
function reset_board(){
  clear();
  fill('black');
  strokeWeight(3);
  stroke(0,0,0);
  background(100);
  textSize(50);
  text(round + 1, 50,50)
  noFill();
  for (let i = 0; i < completedArr.length; i++){
    completedArr[i].draw();
  }

  for (const key in factiondict){
    factiondict[key].draw_faction_inventory()
    factiondict[key].drawfaction()
  }
}
let round = 0;
let turn = 0;
// draw() function is called repeatedly, it's the main animation loop
function draw() {

  // call a method on the instance
  time += deltaTime;
  //print(lineArr[i])
  if (lineArr[i].animationInProgress){
    if (time >= 10){
      lineArr[i].animateStep();
      time = 0;
    }
  }else{
    i += 1;
    turn += 1;
    if (turn == roundlength[round]){
      //print("round done");
      
      
      for (const key in factiondict){
        print(key)
        print(roundCubes[round][key]);
        if (key == 'eat'){
          continue;
        }
        factiondict[key].inventoryDict = {
          'white': roundCubes[round][key][0],
          'green': roundCubes[round][key][1],
          'brown': roundCubes[round][key][2],
          'blue': roundCubes[round][key][3],
          'yellow': roundCubes[round][key][4],
          'black': roundCubes[round][key][5],
          'orange': roundCubes[round][key][6]
        };
      }
      round += 1;
      turn = 0;
      //print(roundlength[round])
    }
  }
}

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
}