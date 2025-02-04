// sketch.js - purpose and description here
// Author: Samina Esteqlal
// Date: February, 2025

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
'use strict';

const VALUE1 = 1;
const VALUE2 = 2;

let myInstance;
let canvasContainer;
var centerHorz, centerVert;

class MyClass {
    constructor(param1, param2) {
        this.property1 = param1;
        this.property2 = param2;
    }
}

var phase = 0;              // Noise phase for the wave
var phaseSpeed = 0.005;     // How fast the phase evolves
var spatialFreq = 0.01;     // Horizontal noise frequency for the wave
var baseAmplitude = 50;     // Base amplitude of the wave

// Audio frequency modulation parameters:
var baseFreq = 220;         // Base oscillator frequency (Hz)
var freqModulation = 100;   // Frequency modulation depth (Hz)

// Base oscillator amplitude (continuous):
var continuousAmp = 0.3;

// Sound objects:
var osc;           // Oscillator for continuous sound
var env;           // Envelope for percussive bursts
var fft;           // FFT analyzer for audio-reactive visuals
var waveTypes = ['sine', 'triangle', 'sawtooth', 'square'];
var currentWaveTypeIndex = 0;

// Background hue for the dynamic background:
var bgHue = 0;
var bgHueSpeed = 0.5; // Adjust for faster or slower background hue changes

function resizeScreen() {
    centerHorz = canvasContainer.width() / 2;
    centerVert = canvasContainer.height() / 2;
    console.log("Resizing...");
    resizeCanvas(canvasContainer.width(), canvasContainer.height());
}

function setup() {
    // Get the container using jQuery.
    canvasContainer = $("#canvas-container");
    // Create the canvas to fit the container.
    let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
    canvas.parent("canvas-container");

    // Create an instance of our class.
    myInstance = new MyClass("VALUE1", "VALUE2");

    // Listen for window resize events.
    $(window).resize(function() {
        resizeScreen();
    });
    resizeScreen();

    // Use HSB color mode for a vivid, psychedelic palette.
    colorMode(HSB, 360, 100, 100, 100);

    osc = new p5.Oscillator('sine');
    osc.start();
    osc.amp(continuousAmp);

    env = new p5.Envelope();
    env.setADSR(0.01, 0.2, 0.2, 0.5);
    env.setRange(0.7, 0);

    fft = new p5.FFT();
}

function draw() {
    // Update the background hue and draw a translucent rectangle for a trailing effect.
    bgHue = (bgHue + bgHueSpeed) % 360;
    noStroke();
    fill(bgHue, 50, 10, 10); // Low brightness and alpha for a trailing effect
    rect(0, 0, width, height);

    // Get the bass energy from the audio.
    let bassEnergy = fft.getEnergy("bass");
    // Map bass energy to the wave's amplitude and stroke weight.
    let amplitude = baseAmplitude + map(bassEnergy, 0, 255, 0, 100);
    let sw = map(bassEnergy, 0, 255, 10, 30);  // Thicker line weight for a psychedelic feel
    // Compute a hue for the wave based on the phase and bass energy.
    let waveHue = (phase * 200 + bassEnergy) % 360;

    // Modulate the oscillator's frequency using Perlin noise.
    let noiseFactor = noise(phase);
    let modulatedFreq = baseFreq + freqModulation * (noiseFactor - 0.5) * 2;
    osc.freq(modulatedFreq);

    // Draw the audio-reactive wave.
    stroke(waveHue, 90, 100);
    strokeWeight(sw);
    noFill();
    beginShape();
    for (let x = 0; x <= width; x += 10) {
        let noiseVal = noise(x * spatialFreq, phase);
        let y = height / 2 + amplitude * (noiseVal - 0.5) * 2;
        vertex(x, y);
    }
    endShape();

    // Update the noise phase for smooth animation.
    phase += phaseSpeed;
}

function mousePressed() {
    // Resume the AudioContext if it is suspended.
    if (getAudioContext().state !== 'running') {
        getAudioContext().resume();
    }
    
    // Trigger the envelope burst.
    env.play(osc);
    
    // After a delay, reset the oscillator's amplitude.
    setTimeout(function() {
        osc.amp(continuousAmp, 0.05);
    }, 1000);
    
    // Change the wave on tap: Reset the noise phase to a new random value.
    phase = random(1000);
    // Optionally adjust the base amplitude for additional variation.
    baseAmplitude = 30 + random(40);
  }

function keyReleased() {
    // Press "s" to save a snapshot of the canvas.
    if (key === 's' || key === 'S') {
        saveCanvas(Date.now().toString(), 'png');
    }

    // Press "o" to cycle through oscillator waveforms.
    if (key === 'o' || key === 'O') {
        currentWaveTypeIndex = (currentWaveTypeIndex + 1) % waveTypes.length;
        osc.setType(waveTypes[currentWaveTypeIndex]);
        console.log("Oscillator type set to " + waveTypes[currentWaveTypeIndex]);
    }
}
