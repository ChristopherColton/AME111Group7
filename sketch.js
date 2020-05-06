  // List of instruments and their circles
var circles = [];

// Chance of getting infected
var probability = 0.25;
var reinfect = false;
var radius = 100;
var orchestraSize = 20;

var stateColors;

var horizSpacing = 100;
var vertSpacing = 100;
var leftMargin = 50;
var rightMargin = 1000;

var tick = 1;

var playing = false;

//pictures
var instrumentImages;
var trumpet;
var electric;
var grand;
var bass;
var violin;

//sounds
var instrumentTracks;
var grandSound;
var trumpetSound;
var electricSound;
var bassSound;
var stringsSound;

// Constants for viral states
const SUSCEPTIBLE = 0;
const INFECTED = 1;
const REMOVED = 2;

function preload(){
  trumpet = loadImage('Images/trumpet.png');
  electric = loadImage('Images/electricPiano.png');
  grand = loadImage('Images/grandPiano.png');
  bass = loadImage('Images/uprightBass.png');
  violin = loadImage('Images/Violin1.png');
  
  grandSound = createAudio('Music/grand_piano.wav');
  trumpetSound = createAudio('Music/trumpets.wav');
  electricSound = createAudio('Music/electric_keys.wav');
  bassSound = createAudio('Music/bass.wav');
  stringsSound = createAudio('Music/strings.wav');
}

function setup() {
  stateColors = [
    color('green'),
    color('red'),
    color('white')
  ];
  instrumentImages = [
    trumpet, electric, grand, bass, violin
  ];
  instrumentTracks = [
    trumpetSound, electricSound, grandSound, bassSound, stringsSound
  ];
  info = createP('Simulation not yet started');
  canvas = createCanvas(1000, 600);
  reset();
  createElement('br');

  
  //button to start
  buttonStart = createButton('Start');
  buttonStart.mousePressed(play);
  //button to stop
  buttonStop = createButton('Stop');
  buttonStop.mousePressed(stop);
  //button to reset simulation
  buttonReset = createButton('Reset');
  buttonReset.mousePressed(reset);
  //slider probability
  createP("Infection probability: ");
  sliderProb = createSlider(0,100,50);
  sliderProb.style('width', '100px');
  //slider for orchestra size
  createP("Orchestra size: ");
  sliderOSize = createSlider(5,60,20);
  //slider for radius size
  createP("Infection radius: ");
  sliderRSize = createSlider(0,100,75);
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
  info.html(
    '<span style="color:black">Day ' + floor(tick/100) + '</span> ' +
    '<span style="color:green">Susceptible: ' + countState(SUSCEPTIBLE) + '</span> ' +
    '<span style="color:red">Infected: ' + countState(INFECTED) + '</span> ' +
    '<span style="color:grey">Removed: ' + countState(REMOVED) + '</span>'
  );
}

function reset() {
  playing = false;
  tick = 1;
  circles = [];
  let x = leftMargin;
  let y = 50;
  for (let i = 0; i < orchestraSize; i++) {
    circles.push(new Circle(x, y));
    x += horizSpacing;
    if (x > rightMargin)
    {
      x = leftMargin;
      y += vertSpacing;
    }
  }
  for (let circle of circles) {
    circle.state = SUSCEPTIBLE;
  }
  for (let sound of instrumentTracks) {
    sound.volume(1);
  }
  circles[0].state = INFECTED;
  for (let inst of instrumentTracks) {
    inst.stop();
  }
  info.html('Simulation not yet started');
}

function stop() {
  playing = false;
  for (let inst of instrumentTracks) {
    inst.pause();
  }
}

function draw() {

  // Draw background
  background(235);

  // Take slider and checkbox inputs
  probability = sliderProb.value() / 100;
  reinfect = checkbox.checked();
  radius = sliderRSize.value();
  orchestraSize = sliderOSize.value();
  
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
  // Update volume of instrument tracks
  for (let i = 0; i < instrumentTracks.length; i++) {
    instrumentTracks[i].volume(volumeOfInstrument(i));
  }
  info.html(
    '<span style="color:black">Day ' + floor(tick/100) + '</span> ' +
    '<span style="color:green">Susceptible: ' + countState(SUSCEPTIBLE) + '</span> ' +
    '<span style="color:red">Infected: ' + countState(INFECTED) + '</span> ' +
    '<span style="color:grey">Removed: ' + countState(REMOVED) + '</span>'
  );
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

function volumeOfInstrument(instNumber) {
  let totalInstruments = countInstruments(instNumber);
  let suscInstruments = countInstrumentState(instNumber, SUSCEPTIBLE);
  if (totalInstruments == 0) return 0;
  return suscInstruments / totalInstruments;
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
