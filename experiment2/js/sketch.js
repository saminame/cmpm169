// sketch.js - purpose and description here
// Author: Samina Esteqlal
// Date: January 20, 2025

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

'use strict';

var tileCount = 50;
var actRandomSeed = 0;

var rectSize = 14;

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

  // create an instance of the class
  myInstance = new MyClass("VALUE1", "VALUE2");

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();

  colorMode(HSB, 460, 50, 50, 100);
  noStroke();
  fill(200, 300, 64, 60);
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  clear();

  randomSeed(actRandomSeed);

  for (var gridY = 0; gridY < tileCount; gridY++) {
    for (var gridX = 0; gridX < tileCount; gridX++) {

      var posX = width / tileCount * gridX;
      var posY = height / tileCount * gridY;

      var shiftX1 = mouseX / 100 * random(-10, 10);
      var shiftY1 = mouseY / 100 * random(-10, 10);
      var shiftX2 = mouseX / 100 * random(-10, 10);
      var shiftY2 = mouseY / 100 * random(-10, 10);
      var shiftX3 = mouseX / 100 * random(-10, 10);
      var shiftY3 = mouseY / 100 * random(-10, 10);
      var shiftX4 = mouseX / 100 * random(-10, 10);
      var shiftY4 = mouseY / 100 * random(-10, 10);

      // Randomize color for each rectangle
      let h = random(360); // Random hue (for HSB mode)
      let s = random(50);  // Random saturation
      let b = random(50);  // Random brightness
      fill(h, s, b, 60);    // Apply random fill color

      push();
      translate(posX, posY);
      beginShape();
      vertex(shiftX1, shiftY1);
      vertex(rectSize + shiftX2, shiftY2);
      vertex(rectSize + shiftX3, rectSize + shiftY3);
      vertex(shiftX4, rectSize + shiftY4);
      endShape();
      pop();
    }
  }
}


// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
}