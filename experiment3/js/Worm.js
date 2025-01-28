
class Node{
  constructor(x,y,size,speed,nextNode,randomOffset,newdirection = createVector(0,0)){
    this.x = x;
    this.y = y;
    this.nextNode = nextNode;
    this.size = size;
    this.direction = newdirection;
    this.randomOffset = randomOffset;
    
    
    this.speed = speed
  }
  set_size(size){
    this.size = size;
  }
  follow(x,y){
    if (abs(this.x - x) > 10 || abs(this.y - y) > 10){
      let newvector = createVector(x - this.x, y - this.y);
      newvector.normalize();
      
      this.x += newvector.x * this.speed + random(-1,1) * this.randomOffset;
      this.y += newvector.y * this.speed + random(-1,1) * this.randomOffset;
      this.direction = createVector(newvector.x * this.speed,newvector.y * this.speed);
    }
    if (this.nextNode != null){
        this.nextNode.follow(this.x,this.y);
    }
  }
  setNextNode(nextNode){
    this.nextNode = nextNode;
  }
  drawSideNodes(leftPoints, rightPoints){
    let degreesToPoint = createVector(1,0).angleBetween(createVector(this.direction.x ,this.direction.y))
    
    stroke('red');
    //line(this.x,this.y,this.x + this.direction.x * 5, this.y + this.direction.y * 5)
    //point(this.x + this.size/2 * cos(degreesToPoint + 90), this.y + this.size/2 * sin(degreesToPoint + 90),10);
    leftPoints.push(createVector(this.x + this.size/2 * cos(degreesToPoint + 90), this.y + this.size/2 * sin(degreesToPoint + 90)))
    //point(this.x + this.size/2 * cos(degreesToPoint - 90), this.y + this.size/2 * sin(degreesToPoint - 90),10);
    rightPoints.push(createVector(this.x + this.size/2 * cos(degreesToPoint - 90), this.y + this.size/2 * sin(degreesToPoint - 90)));
    stroke('black');
  }
  
  drawHead(headPoints,mult){
    let degreesToPoint = createVector(1,0).angleBetween(createVector(mult * this.direction.x ,mult * this.direction.y))
    
    stroke('red');
    //line(this.x,this.y,this.x + this.direction.x * 5, this.y + this.direction.y * 5)
    //point(this.x + this.size/2 * cos(degreesToPoint + 45), this.y + this.size/2 * sin(degreesToPoint + 45),10);
    
    //point(this.x + this.size/2 * cos(degreesToPoint - 45), this.y + this.size/2 * sin(degreesToPoint - 45),10);
   // point(this.x + this.size/2 * cos(degreesToPoint), this.y + this.size/2 * sin(degreesToPoint),10);
    headPoints.push(createVector(this.x + this.size/2 * cos(degreesToPoint + 45), this.y + this.size/2 * sin(degreesToPoint + 45)));
    headPoints.push(createVector(this.x + this.size/2 * cos(degreesToPoint), this.y + this.size/2 * sin(degreesToPoint)));
    headPoints.push(createVector(this.x + this.size/2 * cos(degreesToPoint - 45), this.y + this.size/2 * sin(degreesToPoint - 45)));
    stroke('black');
  }
}
class Worm{
    constructor(x,y,speed,numNodes,randomOffset){
        this.x = x;
        this.y = y;
        this.numNodes = numNodes;
        this.speed = speed;
        this.randomOffset = randomOffset;
        this.nodeArr = [];
        this.leftPoints = [];
        this.rightPoints = [];
        this.headPoints = [];
        this.tailPoints = [];

        this.age = 0;
        this.currentNodes = 5;
        this.color = [286, 100, 80];
    }
    create_worm(){
        this.nodeArr = [];
        
        for (let i = 0; i < this.currentNodes; i++){
            if (i != 0){
                this.nodeArr.push(new Node(this.x,this.y,10 + i * 2,this.speed,this.nodeArr[i-1],this.randomOffset,createVector(1,0)));
            }
            else{
              this.nodeArr.push(new Node(this.x,this.y,10,this.speed,null,this.randomOffset,createVector(1,0)));
            }
            //this.nodeArr[this.nodeArr.length-1].set_size(50);
        }
        
        this.nodeArr.reverse();
        
    }
    draw_circles(enabled){
        this.leftPoints = [];
        this.rightPoints = [];
        this.headPoints = [];
        this.tailPoints = [];
        //print(this.nodeArr)
        strokeWeight(1)
        if (enabled){
            this.nodeArr.forEach((e) => circle(e.x,e.y,e.size));
        }

        strokeWeight(5)
        this.nodeArr[0].drawHead(this.headPoints,1);
        this.nodeArr.forEach((e) => e.drawSideNodes(this.leftPoints,this.rightPoints));
        this.nodeArr[this.nodeArr.length-1].drawHead(this.tailPoints,-1);
      }
    draw_curve(hue){
        //go through leftarrr, reverse rightarr
        
        colorMode(HSL);
        stroke(hue,this.color[1],this.color[2]);
        //fill(this.color[0],this.color[1],this.color[2]);
        fill(hue,this.color[1],this.color[2])
        this.rightPoints.reverse();
        this.headPoints.reverse();
        this.tailPoints.reverse();
        beginShape();
        this.leftPoints.forEach((e) => curveVertex(e.x,e.y));
        this.tailPoints.forEach((e) => curveVertex(e.x,e.y));
        this.rightPoints.forEach((e) => curveVertex(e.x,e.y));
        this.headPoints.forEach((e) => curveVertex(e.x,e.y));
        curveVertex(this.leftPoints[0].x,this.leftPoints[0].y)
        curveVertex(this.leftPoints[1].x,this.leftPoints[1].y)
        curveVertex(this.leftPoints[2].x,this.leftPoints[2].y)
        endShape();
        noFill();
        colorMode(RGB);
      }
    follow(x,y){
        
        this.nodeArr[0].follow(x,y);
    }
    grow(){
        this.age += 1;
        if (this.currentNodes >= this.numNodes){
            this.color[2] -= 3; 
            this.nodeArr.forEach((e)=> e.set_size(e.size  * 9 / 10));
            this.speed * 9 / 10;
            return;
        }
        
        let lastnode = this.nodeArr[this.nodeArr.length-1];
        let temp = new Node(lastnode.x,lastnode.y,10,this.speed,null,0,lastnode.direction);
        //print("temp",temp)
        this.nodeArr[this.nodeArr.length-1].setNextNode(temp);
        this.nodeArr.push(temp);
        //print(this.nodeArr);
        this.currentNodes += 1;
        this.reload_size();
    }
    get_age(){
        return this.age;
    }
    reload_size(){
        this.nodeArr.reverse();
        for(let i = 0; i < this.currentNodes;i++){
            this.nodeArr[i].set_size(10 + i * 2)
        }
        this.nodeArr.reverse();
    }
    get_x_y(){
        return [this.nodeArr[0].x,this.nodeArr[0].y];
    }
}
class Egg{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
    draw_egg(){

      circle(this.x,this.y,25);
    }
    hatch_worm(){
        let temp = new Worm(this.x,this.y,5,20,0);
        temp.create_worm();
        return temp;
    }
}



//function spawn
