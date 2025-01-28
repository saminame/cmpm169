// sketch.js - purpose and description here
// Author: Samina Esteqlal
// Date: January 27, 2025

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

'use strict';

const NORTH = 0;
const NORTHEAST = 1;
const EAST = 2;
const SOUTHEAST = 3;
const SOUTH = 4;
const SOUTHWEST = 5;
const WEST = 6;
const NORTHWEST = 7;

let direction;
let stepSize = 2;
let diameter = 3;
let posX, posY;
let timeOffset = 0;
let flowSpeed = 0.02;
// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;

class MyClass {
  constructor(param1, param2) {
      this.property1 = param1;
      this.property2 = param2;
  }
}

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

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
 
    noStroke();
    fill(100, 150, 255, 150);

    // Initialize particle position
    posX = canvasContainer.width() / 2;
    posY = 0; // Start at the top for waterfall effect
}

function draw() {
  background(135, 206, 250); // Sky blue for the background

  // Draw water region
  fill(10, 30, 60); // Dark blue for water
  rect(0, height / 2, width, height / 2);

  // Draw waves on the water
  for (let y = height / 2; y < height; y += 10) {
      beginShape();
      noFill();
      stroke(50, 120, 200, 150); // Blueish waves
      strokeWeight(2);
      for (let x = 0; x < width; x += 10) {
          let waveOffset = sin((x * 0.05) + (timeOffset * 2)) * 10; // Wave effect
          vertex(x, y + waveOffset);
      }
      endShape();
  }

  // Create dynamic waterfall-like motion
  for (let i = 0; i <= mouseX; i++) {
      direction = int(random(0, 8));

      if (direction == NORTH) {
          posY -= stepSize;
      } else if (direction == NORTHEAST) {
          posX += stepSize;
          posY -= stepSize;
      } else if (direction == EAST) {
          posX += stepSize;
      } else if (direction == SOUTHEAST) {
          posX += stepSize;
          posY += stepSize;
      } else if (direction == SOUTH) {
          posY += stepSize;
      } else if (direction == SOUTHWEST) {
          posX -= stepSize;
          posY += stepSize;
      } else if (direction == WEST) {
          posX -= stepSize;
      } else if (direction == NORTHWEST) {
          posX -= stepSize;
          posY -= stepSize;
      }

      // Wrap around edges to simulate continuous flow
      if (posX > width) posX = 0;
      if (posX < 0) posX = width;
      if (posY < 0) posY = height;
      if (posY > height) posY = 0;

      fill(255, 255, 255, 100); // Foam effect
      ellipse(posX + stepSize / 2, posY + stepSize / 2, diameter, diameter);
  }

  // Flowing vertical curves for waterfall
  for (let x = 0; x < width; x += 10) { // Space between lines
      beginShape();
      noFill();
      stroke(100, 150 + noise(x * 0.02, timeOffset) * 100, 255, 120); // Gradient blue
      strokeWeight(2 + noise(x * 0.01, timeOffset) * 2); // Vary thickness

      for (let y = 0; y < height / 2; y += 10) { // Line height
          let offsetX = noise(x * 0.02, y * 0.02, timeOffset) * 20; // Horizontal wiggle
          let offsetY = noise(x * 0.02, y * 0.02, timeOffset) * 5; // Slight vertical shift
          vertex(x + offsetX, y + offsetY);
      }
      endShape();
  }

  timeOffset += flowSpeed; // Increment for smooth animation
}
