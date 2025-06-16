var interval = null;
const input = document.getElementById('input');
var amplitude = 50;

// create web audio api elements
const audioCtx = new AudioContext();
const gainNode = audioCtx.createGain();

notes = new Map()

notes.set("C", 261.6)
notes.set("D", 293.7)
notes.set("E", 329.6)
notes.set("F", 349.2)
notes.set("G", 392)
notes.set("A", 440)
notes.set("B", 493.9)

notes.set("c", 261.6)
notes.set("d", 293.7)
notes.set("e", 329.6)
notes.set("f", 349.2)
notes.set("g", 392)
notes.set("a", 440)
notes.set("b", 493.9)

//define canvas variables
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var width = ctx.canvas.width;
var height = ctx.canvas.height;

var counter = 0;
function drawWave() {
    ctx.clearRect(0, 0, width, height);
    window.x = 0;
    window.y = height/2;
    ctx.moveTo(x, y);
    ctx.beginPath();
	counter = 0;
    interval = setInterval(line, 20);
}

function line() {
    ctx.lineTo(x, y);
    ctx.stroke();
    y = height/2 + (amplitude * Math.sin(2 * Math.PI * freq * x));
    x++;
    counter++;
    if (counter > 50) {
        clearInterval(interval)
    }
}

function frequency(pitch) {
    // create Oscillator node
    window.freq = pitch / 10000;

    const oscillator = audioCtx.createOscillator();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.type = "sine";

    oscillator.start();
    gainNode.gain.value = 0;

    gainNode.gain.setValueAtTime(100, audioCtx.currentTime);
    oscillator.frequency.setValueAtTime (pitch, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime + 1);
}

function handle() {
    audioCtx.resume();
    gainNode.gain.value = 0;
    var user = String(input.value)
    frequency(notes.get(user));
    drawWave()
}