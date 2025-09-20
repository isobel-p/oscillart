var interval = null;
const input = document.getElementById('input');
const colour_picker = document.getElementById("colour");
const volume = document.getElementById('vol-slider')
const recording_toggle = document.getElementById('record');

var reset = false;
var x = 0;
var y = 0;
var freq = 0;
var timepernote = 0;
var length = 0;
var blob, recorder = null;
var chunks = [];

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
    y = height/2 + ((volume.value/100)*40) * Math.sin(x * 2  * Math.PI * freq * (0.5 * length));
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

    gainNode.gain.setValueAtTime(((volume.value/100)*40), audioCtx.currentTime);
    setting = setInterval(() => {gainNode.gain.value = ((volume.value/100)*40)}, 1);
    oscillator.frequency.setValueAtTime (pitch, audioCtx.currentTime);
    setTimeout(() => {clearInterval(setting); gainNode.gain.value = 0;}, ((timepernote)-10));
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

function startRecording(){
    const canvasStream = canvas.captureStream(20);
    const audioDestination = audioCtx.createMediaStreamDestination();
    const combinedStream = new MediaStream();
    canvasStream.getVideoTracks().forEach(track => combinedStream.addTrack(track));
    audioDestination.stream.getAudioTracks().forEach(track => combinedStream.addTrack(track));
    gainNode.connect(audioDestination);
    recorder = new MediaRecorder(combinedStream, {mimeType:'video/webm'});
    recorder.ondataavailable = e => {
        if (e.data.size > 0) {
        chunks.push(e.data);
        }
        };


        recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'recording.webm';
        a.click();
        URL.revokeObjectURL(url);
    };
    recorder.start()
}

function toggle(){
    is_recording != is_recording;
    if(is_recording){
        recording_toggle.innerHTML = "Stop Recording";
        startRecording();
    } else {
        recording_toggle.innerHTML = "Start Recording";
        recorder.stop();
    }
}