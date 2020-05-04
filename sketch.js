// List of instruments and their circles
var circles = [];

// Chance of getting infected
var probability = 0.25;

// X and y of... what again?
var x = 50;
var y = 50;
var stateColors;

var horizSpacing = 100;
var vertSpacing = 100;
var leftMargin = 0;
var rightMargin = 1000;

var tick = 1;

var playing = false;

//pictures
var clarinet;
var drum;
var sax;
var tuba;
var violin;
//sounds
var instOne;
var instTwo;
var instThree;
var instrumentImages;
var instrumentTracks;

// Constants for viral states
const SUSCEPTIBLE = 0;
const INFECTED = 1;
const REMOVED = 2;

function preload(){
  clarinet = loadImage('images/Clarinet1.png');
  drum = loadImage('images/Drum1.png');
  sax = loadImage('images/Sax1.png');
  tuba = loadImage('images/Tuba1.png');
  violin = loadImage('images/Violin1.png');
  instOne = loadSound('music/One (130 BPM).mp3');
  instTwo = loadSound('music/Two (130 BPM).mp3');
  instThree = loadSound('music/Three (130 BPM).mp3');
}

function setup() {
  stateColors = [
    color('white'),
    color('red'),
    color('green')
  ];
  instrumentImages = [
    clarinet, drum, sax, tuba, violin
  ];
  instrumentTracks = [
    instOne, instTwo, instThree
  ];
  createCanvas(1000, 600);
  for (let i = leftMargin; i < 10; i++) {
    circles.push(new Circle(x, y));
    x += horizSpacing;
    if (x > rightMargin)
    {
      x = leftMargin;
      y += vertSpacing;
    }
  }
  //button to start
  buttonStart = createButton('Start');
  buttonStart.position(100,100);
  buttonStart.mousePressed(play);
  //button to stop
  buttonStop = createButton('Stop');
  buttonStop.position(150,100);
  buttonStop.mousePressed(stop);
  //button to reset simulation
  buttonReset = createButton('Reset');
  buttonReset.position(200,100);
  buttonReset.mousePressed(reset);
  //slider probability
  sliderProb = createSlider(0,100,25);
  sliderProb.position(100,50);
  sliderProb.style('width', '100px');

  ellipseMode(CENTER);
  imageMode(CENTER);
  circles[0].state = INFECTED;
} 

function play() {
  playing = true;
  for (let inst of instrumentTracks) {
    inst.loop();
  }
}

function reset() {
  playing = false;
  tick = 1;
  for (let circle of circles) {
    circle.state = SUSCEPTIBLE;
  }
  circles[0].state = INFECTED;
  for (let inst of instrumentTracks) {
    inst.stop();
  }
}

function stop() {
  playing = false;
  for (let inst of instrumentTracks) {
    inst.pause();
  }
}


function draw() { 
  background(255);

  probability = sliderProb.value() / 100;

  if (tick % 100 == 0 && playing) {
    update();
  }

  for (let i = 0; i < circles.length; i++) {
    circles[i].displayRadius();
  }
  for (let i = 0; i < circles.length; i++) {
    circles[i].display();
  }

  if (playing) tick++;
  fill(color('red'));
  textSize(50);
  text("Day " + floor(tick/100), 0, 400);
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
  this.r = 100;
  this.instrument = floor(random(5));
  

  // Display radius
  this.displayRadius = function() {
    noStroke();
    fill(color('pink'));
    ellipse(this.x, this.y, this.r*2);
  };
  
  // Display actual instrument
  this.display = function() {
    stroke(color('black'));
    fill(stateColors[this.state]);
    ellipse(this.x, this.y, this.r);
    image(instrumentImages[this.instrument], this.x, this.y, this.r, this.r);
  };
  
  this.isTouching = function(other) {
    return dist(this.x, this.y, other.x, other.y) < this.r + other.r;
  };
}