// sketch.js - purpose and description here
// Author: Samina Esteqlal
// Date: February 10, 2025

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
let electrons = [];
let numElectrons = 12;
let colors = [];
let nucleusGlow = 0;

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

function setup() {
    canvasContainer = $("#canvas-container");
    let canvas = createCanvas(canvasContainer.width(), canvasContainer.height(), WEBGL);
    canvas.parent("canvas-container");

    myInstance = new MyClass("VALUE1", "VALUE2");

    $(window).resize(function() {
        resizeScreen();
    });
    resizeScreen();

    // Initialize electrons with randomized starting positions
    let orbitRadii = [70, 100, 130, 160, 190, 220];
    for (let i = 0; i < numElectrons; i++) {
        electrons.push({
            orbitIndex: floor(random(orbitRadii.length)),
            angle: random(TWO_PI),
            speed: random(0.01, 0.03)
        });
        colors.push(color(random(100, 255), random(100, 255), random(100, 255)));
    }
}

function draw() {
    background(0);
    rotateY(frameCount / 300.0);
    rotateX(frameCount / 400.0);
    
    let orbitColors = [
        color(255, 0, 0),
        color(0, 255, 0),
        color(0, 0, 255),
        color(255, 255, 0),
        color(255, 0, 255),
        color(0, 255, 255)
    ];

    let orbitRadii = [70, 100, 130, 160, 190, 220];
    for (let j = 0; j < orbitRadii.length; j++) {
        push();
        rotateX(j * PI / 4);
        rotateY(j * PI / 5);
        stroke(orbitColors[j % orbitColors.length]);
        strokeWeight(2);
        noFill();
        beginShape();
        for (let i = 0; i <= 100; i++) {
            let angle = map(i, 0, 100, 0, TWO_PI);
            let x = cos(angle) * orbitRadii[j];
            let y = sin(angle) * orbitRadii[j];
            let z = sin(angle * 2) * 5;
            vertex(x, y, z);
        }
        endShape(CLOSE);
        pop();
    }

    // Draw moving electrons
    for (let i = 0; i < electrons.length; i++) {
        let e = electrons[i];
        let r = orbitRadii[e.orbitIndex];
        let x = cos(e.angle) * r;
        let y = sin(e.angle) * r;
        let z = sin(e.angle * 2) * 5;
        push();
        translate(x, y, z);
        fill(colors[i]);
        noStroke();
        sphere(5);
        pop();
        e.angle += e.speed;
    }

    // Create a pulsating glow effect for the nucleus
    nucleusGlow = sin(frameCount * 0.05) * 50 + 200;
    for (let i = 0; i < 8; i++) {
        push();
        let angle = map(i, 0, 8, 0, TWO_PI);
        let x = cos(angle) * 12;
        let y = sin(angle) * 12;
        let z = sin(angle * 2) * 12;
        fill(nucleusGlow, random(50, 200), random(50, 255));
        noStroke();
        translate(x, y, z);
        sphere(8);
        pop();
    }
}
