// sketch.js - purpose and description here
// Author: Samina Esteqlal
// Date: February 17, 2025

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
'use strict';

const VALUE1 = 1;
const VALUE2 = 2;

// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;

class MyClass {
    constructor(param1, param2) {
        this.property1 = param1;
        this.property2 = param2;
    }

    myMethod() {
        // code to run when method is called
    }
}

var x = 0;
var y = 0;
var stepSize = 100.0; // Slower print by reducing step size

var gothicFonts = ['Blackletter', 'Old English Text MT', 'Uncial Antiqua', 'Fraktur', 'Cinzel Decorative'];
var fontSizeMin = 12;
var angleDistortion = 0.0;

var haiku = [];
var haikuLines = [
  ['love between us is', 'speech and breath. loving you is', 'a long river running.']
];
var haikuTitle = "Haiku [for you] by Sonia Sanchez";
var counter = 0;
var colors = ['rgb(230, 204, 178)', 'rgb(180, 140, 120)', 'rgb(150, 120, 110)', 'rgb(210, 180, 160)', 'rgb(200, 170, 150)']; // Dark, muted gothic tones

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2;
  centerVert = canvasContainer.height() / 2;
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
}

function setup() {
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  
  myInstance = new MyClass("VALUE1", "VALUE2");
  
  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();
  
  background('rgb(65,14,14)');
  cursor(CROSS);
  
  x = mouseX;
  y = mouseY;
  
  textAlign(CENTER);
  fill(255);
  displayTitle();
  generateHaiku();
}

function draw() {
  myInstance.myMethod();

  // Add dried tear stain effect
  for (let i = 0; i < 5; i++) {
    let stainX = random(width);
    let stainY = random(height);
    let stainSize = random(5, 20);
    let opacity = random(50, 100);
    
    noStroke();
    fill(100, 50, 50, opacity); // Muted, uneven stains
    ellipse(stainX, stainY, stainSize, stainSize * random(1, 2));
    
    for (let j = 0; j < random(3, 6); j++) {
      let dripX = stainX + random(-5, 5);
      let dripY = stainY + j * random(3, 8);
      let dripSize = stainSize * random(0.2, 0.5);
      fill(80, 40, 40, opacity * 0.8);
      ellipse(dripX, dripY, dripSize, dripSize * 1.5);
    }
  }

  if (mouseIsPressed && mouseButton == LEFT) {
    var d = dist(x, y, mouseX, mouseY);
    var newLine = haiku[counter % haiku.length].split(" ");
    textFont(random(gothicFonts));
    fill(colors[counter % colors.length]);

    push();
    translate(x, y);
    rotate(random(-PI / 8, PI / 8)); // Random rotation
    for (let i = 0; i < newLine.length; i++) {
      textSize(random(12, 40)); // Random font sizes for words
      text(newLine[i], i * random(20, 50), random(-10, 10));
    }
    pop();

    counter++;
    x = x + cos(angleDistortion) * stepSize;
    y = y + sin(angleDistortion) * stepSize;
  }
}

function mousePressed() {
  x = mouseX;
  y = mouseY;
}

function keyReleased() {
  if (key == 's' || key == 'S') saveCanvas('haiku_art', 'png');
  if (keyCode == DELETE || keyCode == BACKSPACE) {
    background('rgb(65,14,14)');
    displayTitle();
    generateHaiku();
    counter = 0;
  }
}

function keyPressed() {
  if (keyCode == UP_ARROW) angleDistortion += 0.1;
  if (keyCode == DOWN_ARROW) angleDistortion -= 0.1;
}

function generateHaiku() {
  haiku = haikuLines[0];
}

function displayTitle() {
  textSize(32);
  textFont('Cinzel Decorative');
  let goldGradient = lerpColor(color(255, 215, 0), color(200, 180, 50), sin(frameCount * 0.05));
  fill(goldGradient);
  text(haikuTitle, width / 2, height / 4);
}
