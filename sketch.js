// List of instruments and their circles
var circles = [];

// Chance of getting infected
var probability = 0.25;
var reinfect = false;
var radius = 100;

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
  canvas = createCanvas(1000, 600);
  for (let i = leftMargin; i < 10; i++) {
    circles.push(new Circle(x, y));
    x += horizSpacing;
    if (x > rightMargin)
    {
      x = leftMargin;
      y += vertSpacing;
    }
  }
  createElement('br');
  //button to start
  buttonStart = createButton('Start');
  //buttonStart.position(-500,100, 'sticky');
  buttonStart.mousePressed(play);
  //button to stop
  buttonStop = createButton('Stop');
  //buttonStop.position(-500,150, 'sticky');
  buttonStop.mousePressed(stop);
  //button to reset simulation
  buttonReset = createButton('Reset');
  //buttonReset.position(-500,200, 'sticky');
  buttonReset.mousePressed(reset);
  //slider probability
  createP("Infection probability: ");
  sliderProb = createSlider(0,100,25);
  //sliderProb.position(100,50);
  sliderProb.style('width', '100px');
  //slider for orchestra size
  createP("Orchestra size: ");
  sliderOSize = createSlider(0,100,25);
  //sliderOSize.position(100,75);
  //slider for radius size
  createP("Infection radius: ");
  sliderRSize = createSlider(0,100,25);
  //sliderRSize.position(100,100);
  //check for reinfection or not
  checkbox = createCheckbox('Reinfection', false);

  ellipseMode(CENTER);
  imageMode(CENTER);
  circles[0].state = INFECTED;
  circles[0].infectedCountdown = floor(random(2, 5));
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

  // Draw background
  background(255);

  // Take slider and checkbox inputs
  probability = sliderProb.value() / 100;
  reinfect = checkbox.checked();
  radius = sliderRSize.value();

  
  // Calculate generation
  if (tick % 100 == 0 && playing) {
    update();
  }

  // Display circles
  for (let i = 0; i < circles.length; i++) {
    circles[i].displayRadius();
  }
  for (let i = 0; i < circles.length; i++) {
    circles[i].display();
  }

  // Increase tick
  if (playing) tick++;

  // Draw text
  fill(color('red'));
  textSize(50);
  text("Day " + floor(tick/100), 0, 400);
  textSize(25);
  text("Susceptible: " + countState(SUSCEPTIBLE), 0, 450);
  text("Infected: " + countState(INFECTED), 0, 500);
  
  //text for sliders
  text('Infection Probability',sliderProb.x * 2 + sliderProb.width, 35);
  text('Orchestra Size');
  text('Radius Size');
  
}

function update() {
  // Start with copy of previous generation
  for (let circ of circles) {
    circ.newState = circ.state;
  }
  // Count down days until each infected instrument is removed
  for (let circ of circles) {
    if (circ.state == INFECTED) {
      circ.infectedCountdown--;
      if (circ.infectedCountdown < 1) {
        circ.newState = REMOVED;
      }
    }
  }
  // Iterate through every pair of circles, possibly infecting if they touch
  for (let i = 0; i < circles.length; i++) {
    let circ1 = circles[i];
    for (let j = 0; j < i; j++) {
      let circ2 = circles[j];
      if (circ1.isTouching(circ2)) {
         
        if (circ2.state == INFECTED && random(0, 1) < probability && circ1.infectable()) {
          circ1.newState = INFECTED;
          circ1.infectedCountdown = floor(random(2, 5));
        }
        
        if (circ1.state == INFECTED && random(0, 1) < probability && circ2.infectable()) {
          circ2.newState = INFECTED;
          circ2.infectedCountdown = floor(random(2, 5));
        }

      }
    }
  }
  // Set state to newly created state
  for (let circ of circles) {
    circ.state = circ.newState;
  }
}

function Circle(x, y) {
  this.x = x;
  this.y = y;
  this.state = SUSCEPTIBLE;
  this.instrument = floor(random(5));
  this.infectedCountdown = 0;
  

  // Display radius
  this.displayRadius = function() {
    noStroke();
    fill(color('pink'));
    ellipse(this.x, this.y, radius*2);
  };
  
  // Display actual instrument
  this.display = function() {
    stroke(color('black'));
    fill(stateColors[this.state]);
    ellipse(this.x, this.y, radius);
    image(instrumentImages[this.instrument], this.x, this.y, radius, radius);
  };
  
  this.isTouching = function(other) {
    return dist(this.x, this.y, other.x, other.y) < radius + radius;
  };

  this.infectable = function() {
    return this.state == SUSCEPTIBLE || (reinfect && this.state == REMOVED);
  }
}

function countInstruments(instNumber) {
  let n = 0;
  for (let circ of circles) {
    if (circ.instrument == instNumber) {
      n++;
    }
  }
  return n;
}

function countInstrumentState(instNumber, state) {
  let n = 0;
  for (let circ of circles) {
    if (circ.instrument == instNumber && circ.state == state) {
      n++;
    }
  }
  return n;
}

function countState(state) {
  let n = 0;
  for (let circ of circles) {
    if (circ.state == state) {
      n++;
    }
  }
  return n;
}