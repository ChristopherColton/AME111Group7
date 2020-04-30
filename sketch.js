var circles = [];
var probability = 0.25;

// Constants for viral states
const SUSCEPTIBLE = 0;
const INFECTED = 1;
const REMOVED = 2;

function setup() { 
  createCanvas(400, 200);
  for (let i = 0; i < 10; i++) {
    circles.push(new Circle());
  }
  ellipseMode(CENTER);
} 

function draw() { 
  background(255);

  update();

  for (let i = 0; i < circles.length; i++) {
    circles[i].display();
  }
}

function update() {
  for (let i = 0; i < circles.length; i++) {
    let circ1 = circles[i];
    for (let j = 0; j < i; j++) {
      let circ2 = circles[j];
      if (circ1.isTouching(circ2)) {
        if (circ2.state == INFECTED && random(0, 1) < probability) {
          circ1.state = INFECTED;
        }
        if (circ1.state == INFECTED && random(0, 1) < probability) {
          circ2.state = INFECTED;
        }
      }
    }
  }  
}

function Circle(x, y) {
  this.x = x;
  this.y = y;
  this.state = SUSCEPTIBLE;
  this.r = 25;
  this.col = color(255);
  
  this.display = function() {
    console.log("Displaying circle at " + x + ", " + y);
    fill(this.col);
    ellipse(this.x, this.y, this.r*2);
  }
  
  this.changeColor = function() {
    this.col = color('red');
  }

  this.isTouching = function(other) {
    return dist(this.x, this.y, other.x, other.y) < this.r + other.r;
  }
}