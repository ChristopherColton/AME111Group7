/** 
function draw() {
    if (mouseIsPressed) {
        fill(0);
    } else {
        fill(255);
    }
    text("A", mouseX, mouseY);
}*/

var circ1;
var circ2;

function setup() { 
  createCanvas(400, 200);
  circ1 = new Circle();
  circ2 = new Circle();
  ellipseMode(CENTER);
} 

function draw() { 
  background(255);
  
  circ1.display();
  circ2.display();
  
  
  var d = dist(circ1.x1, circ1.y1, circ2.x2, circ2.y2);
  
  if (d < circ1.r + circ2.r) {
    //fill(150);
    //fill(changeColor());
    circ1.changeColor();
  	circ2.changeColor();
  }
}

function Circle() {
  this.x1 = 50;
  this.y1 = 100;
  this.x2 = 75;
  this.y2 = 100;
  this.r = 25;
  this.col = color(255);
  
  this.display = function() {
    ellipse(this.x1, this.y1, this.r*2);
    ellipse(this.x2, this.y2, this.r*2);
    fill(this.col);
  }
  
  this.changeColor = function() {
    this.col = color(150);
  }
}