// sketch.js - purpose and description here
// Author: Samina Esteqlal
// Date: Febraury 24, 2025

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

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2;
  centerVert = canvasContainer.height() / 2;
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
}

var tileCount = 20;
var actRandomSeed = 0;
var backgroundColor;
var storyData = [];
var moodColors = {
  joy: [60, 100, 100],
  sadness: [240, 100, 100],
  anger: [0, 100, 100],
  fear: [280, 100, 100],
  disgust: [120, 100, 100],
  anxiety: [30, 100, 100],
  embarrassment: [300, 80, 100],
  envy: [180, 100, 80]
};
var currentMood = 'joy';
var moduleRadiusBackground = 30;
var moduleRadiusForeground = 15;
var moduleAlphaBackground = 100;
var moduleAlphaForeground = 100;
var backgroundBalls = [];
var tileSize;

function setup() {
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");

  myInstance = new MyClass("VALUE1", "VALUE2");

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();
  
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
  backgroundColor = color(240, 30, 30);
  tileSize = width / tileCount;

  for (var gridY = 0; gridY < tileCount; gridY++) {
    for (var gridX = 0; gridX < tileCount; gridX++) {
      backgroundBalls.push({
        x: gridX * tileSize,
        y: gridY * tileSize,
        vx: random(-1, 1),
        vy: random(-1, 1),
        color: [0, 0, 50],
        mood: 'neutral',
        trail: []
      });
    }
  }
}

function draw() {
  background(backgroundColor);
  randomSeed(actRandomSeed);
  myInstance.myMethod();

  let moodCounts = {};
  for (let ball of backgroundBalls) {
    moodCounts[ball.mood] = (moodCounts[ball.mood] || 0) + 1;
  }
  let dominantMood = Object.keys(moodCounts).length > 0 
    ? Object.keys(moodCounts).reduce((a, b) => moodCounts[a] > moodCounts[b] ? a : b) 
    : 'joy'; // Default to joy if no mood is detected

  if (moodColors[dominantMood]) {
    backgroundColor = color(moodColors[dominantMood][0], moodColors[dominantMood][1] / 2, 50);
  }

  for (var i = 0; i < backgroundBalls.length; i++) {
    var ball = backgroundBalls[i];
    
    if (ball.mood === 'joy') {
      ball.vx *= 1.02;
      ball.vy *= 1.02;
      ball.vx = constrain(ball.vx, -2, 2);
      ball.vy = constrain(ball.vy, -2, 2);
    } else if (ball.mood === 'sadness') {
      ball.vy += 0.05;
    } else if (ball.mood === 'anger') {
      ball.vx += random(-0.5, 0.5);
      ball.vy += random(-0.5, 0.5);
    }

    ball.x += ball.vx;
    ball.y += ball.vy;

    ball.trail.push({ x: ball.x, y: ball.y });
    if (ball.trail.length > 10) ball.trail.shift();

    if (ball.x < 0 || ball.x > width) {
      ball.vx *= -1;
      ball.x = constrain(ball.x, 0, width);
    }
    if (ball.y < 0 || ball.y > height) {
      ball.vy *= -1;
      ball.y = constrain(ball.y, 0, height);
    }

    for (let j = 0; j < ball.trail.length; j++) {
      let t = ball.trail[j];
      fill(ball.color[0], ball.color[1], ball.color[2], (j / ball.trail.length) * 50);
      ellipse(t.x, t.y, moduleRadiusBackground * (j / ball.trail.length));
    }
    
    fill(ball.color[0], ball.color[1], ball.color[2], 50);
    ellipse(ball.x, ball.y, moduleRadiusBackground, moduleRadiusBackground);
  }
}

function mousePressed() {
  actRandomSeed = random(100000);
  var moodColor = moodColors[currentMood];
  
  var closestDist = Infinity;
  var closestBall = null;
  for (var i = 0; i < backgroundBalls.length; i++) {
    var d = dist(mouseX, mouseY, backgroundBalls[i].x, backgroundBalls[i].y);
    if (d < closestDist) {
      closestDist = d;
      closestBall = backgroundBalls[i];
    }
  }
  if (closestBall) {
    closestBall.color = moodColor;
    closestBall.mood = currentMood;
  }
}

function keyPressed() {
  if (key == 'j') currentMood = 'joy';
  if (key == 's') currentMood = 'sadness';
  if (key == 'a') currentMood = 'anger';
  if (key == 'f') currentMood = 'fear';
  if (key == 'd') currentMood = 'disgust';
  if (key == 'x') currentMood = 'anxiety';
  if (key == 'e') currentMood = 'embarrassment';
  if (key == 'v') currentMood = 'envy';
}
