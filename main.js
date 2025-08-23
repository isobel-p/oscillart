var interval = null;
const input = document.getElementById('input');
const colour_picker = document.getElementById("colour");
var amplitude = 50;
var reset = false;
var x = 0;
var y = 0;
var freq = 0;
var timepernote = 0;
var length = 0;

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

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var width = ctx.canvas.width;
var height = ctx.canvas.height;

var counter = 0;
function drawWave() {
    clearInterval(interval);
    if (reset) {
        ctx.clearRect(0, 0, width, height);
        window.x = 0;
        window.y = height/2;
        ctx.moveTo(x, y);
        ctx.beginPath();
    }
	counter = 0;
    interval = setInterval(line, 20);
    reset = false;
}

function line() {
    ctx.lineTo(x, y);
    ctx.strokeStyle = colour_picker.value;
    ctx.stroke();
    y = height/2 + amplitude * Math.sin(x * 2  * Math.PI * freq * (0.5 * length));
    x++;
    counter++;
    if (counter > (timepernote/20)) {
        clearInterval(interval)
    }
}

function frequency(pitch) {
    window.freq = pitch / 10000;

    const oscillator = audioCtx.createOscillator();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.type = "sine";

    oscillator.start();
    gainNode.gain.value = 0;

    gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
    oscillator.frequency.setValueAtTime (pitch, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime + (timepernote/1000)-0.1);
    oscillator.stop(audioCtx.currentTime + (timepernote/1000)-0.1);
}

function handle() {
    reset = true;
    audioCtx.resume();
    gainNode.gain.value = 0;
    var user = String(input.value)
    var noteslist = [];
    length = user.length;
    timepernote = (6000 / length);
    for (i=0; i < user.length; i++) {
        noteslist.push(notes.get(user.charAt(i)));
    }
    let j = 0;
    repeat = setInterval(() => {
        if (j < noteslist.length) {
            frequency(parseInt(noteslist[j]));
            drawWave();
        j++
        } else {
            clearInterval(repeat)
        }
    }, 2000)
} 