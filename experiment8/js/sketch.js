// sketch.js - purpose and description here
// Author: Samina Esteqlal
// Date: March 5, 2025

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

var textTyped = "SPEAK"; // Default text
var drawMode = 1;
var fontSize = 250; // Initial font size
var padding = 10;
var nOff = 0;
var pointDensity = 8;
let keyBool = false;
let speechRec;

var colors;

var paths;
var textImg;

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
  setupText(); // Redraw text on resize
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

  $(window).resize(function () {
    resizeScreen();
  });
  resizeScreen();

  colors = [color(65, 105, 185), color(245, 95, 80), color(15, 233, 118)];
  pixelDensity(1);

  setupText();
  setupSpeech(); // Initialize speech recognition
}

function setupSpeech() {
  // Check for browser support
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    speechRec = new SpeechRecognition();
    speechRec.continuous = true; // Keep listening
    speechRec.interimResults = false; // Only final results
    speechRec.lang = "en-US"; // Set language
    speechRec.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      textTyped = transcript.toUpperCase(); // Update the text
      console.log("You said:", textTyped); // Log the recognized text
      setupText(); // Update the visualization
    };
    speechRec.start();
  } else {
    console.error("Web Speech API is not supported in this browser.");
  }
}

function setupText() {
  // Adjust font size dynamically based on canvas width
  fontSize = Math.min(width / 10, 250); // Set a maximum font size
  textImg = createGraphics(width, height);
  textImg.pixelDensity(1);
  textImg.background(255); // Set the background color
  textImg.textSize(fontSize);
  textImg.fill(0); // Set the text color (black)

  // Wrap text into lines that fit within the canvas width
  let words = textTyped.split(" ");
  let lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    let word = words[i];
    let testLine = currentLine + " " + word;
    let testWidth = textImg.textWidth(testLine);

    if (testWidth > width - padding * 2) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine);

  // Draw each line of text
  let lineHeight = fontSize * 1.2; // Adjust line height
  let y = padding + fontSize;

  for (let line of lines) {
    textImg.text(line, padding, y);
    y += lineHeight;
  }

  textImg.loadPixels(); // Load the pixels for further processing
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  background(255);

  nOff++;

  for (var x = 0; x < textImg.width; x += pointDensity) {
    for (var y = 0; y < textImg.height; y += pointDensity) {
      // Calculate the index for the pixels array from x and y
      var index = (x + y * textImg.width) * 4;
      // Get the red value from image
      var r = textImg.pixels[index];

      if (r < 128) {
        if (drawMode == 1) {
          strokeWeight(1);

          var noiseFac = map(mouseX, 0, width, 0, 1);
          var lengthFac = map(mouseY, 0, height, 0.01, 1);

          var num = noise((x + nOff) * noiseFac, y * noiseFac);
          if (num < 0.6) {
            stroke(colors[0]);
          } else if (num < 0.7) {
            stroke(colors[1]);
          } else {
            stroke(colors[2]);
          }

          push();
          translate(x, y);
          rotate(radians(frameCount));
          line(0, 0, fontSize * lengthFac, 0);
          pop();
        }

        if (drawMode == 2) {
          stroke(0, 0, 0);
          strokeWeight(1);
          noStroke();
          push();
          translate(x, y);

          var num = noise((x + nOff) / 10, y / 10);

          if (num < 0.6) {
            fill(colors[0]);
          } else if (num < 0.7) {
            fill(colors[1]);
          } else {
            fill(colors[2]);
          }

          var w = noise((x - nOff) / 10, (y + nOff * 0.1) / 10) * 20;
          var h = noise((x - nOff) / 10, (y + nOff * 0.1) / 10) * 10;
          ellipse(0, 0, w, h); // rect() is cool too
          pop();
        }

        if (drawMode == 3) {
          stroke(0, 0, 0);
          strokeWeight(1);
          noStroke();

          var num = random(1);

          if (num < 0.6) {
            fill(colors[0]);
          } else if (num < 0.7) {
            fill(colors[1]);
          } else {
            fill(colors[2]);
          }

          push();
          beginShape();
          for (var i = 0; i < 3; i++) {
            var ox =
              (noise((i * 1000 + x - nOff) / 30, (i * 3000 + y + nOff) / 30) -
                0.5) *
              pointDensity *
              6;
            var oy =
              (noise((i * 2000 + x - nOff) / 30, (i * 4000 + y + nOff) / 30) -
                0.5) *
              pointDensity *
              6;
            vertex(x + ox, y + oy);
          }
          endShape(CLOSE);
          pop();
        }

        if (drawMode == 4) {
          stroke(colors[0]);
          strokeWeight(3);

          point(x - 10, y - 10);
          point(x, y);
          point(x + 10, y + 10);

          for (var i = 0; i < 5; i++) {
            if (i == 1) {
              stroke(colors[1]);
            } else if (i == 3) {
              stroke(colors[2]);
            }

            if (i % 2 == 0) {
              var ox = noise((10000 + i * 100 + x - nOff) / 10) * 10;
              var oy = noise((20000 + i * 100 + x - nOff) / 10) * 10;
              point(x + ox, y + oy);
            } else {
              var ox = noise((30000 + i * 100 + x - nOff) / 10) * 10;
              var oy = noise((40000 + i * 100 + x - nOff) / 10) * 10;
              point(x - ox, y - oy);
            }
          }
        }
      }
    }
  }
}

// keyPressed() function is called once after every time a key button is pressed
function keyPressed() {
  if (keyCode === CONTROL) saveCanvas(gd.timestamp(), "png");

  if (keyCode === DELETE || keyCode === BACKSPACE) {
    textTyped = textTyped.substring(0, max(0, textTyped.length - 1));
    setupText();
  }
  if (keyCode === ENTER || keyCode === RETURN) {
    textTyped += "\n";
    setupText();
  }
  if (keyCode === LEFT_ARROW) {
    drawMode--;
    if (drawMode < 1) drawMode = 4;
  }
  if (keyCode === RIGHT_ARROW) {
    drawMode++;
    if (drawMode > 4) drawMode = 1;
  }
  if (keyCode === DOWN_ARROW) {
    pointDensity--;
    if (pointDensity < 4) pointDensity = 4;
  }
  if (keyCode === UP_ARROW) {
    pointDensity++;
  }
}

function keyTyped() {
  if (keyCode >= 32) {
    textTyped += key;
    setupText();
  }
}