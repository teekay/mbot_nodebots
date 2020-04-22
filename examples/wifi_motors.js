// This example from the original repo had a description copy-pasted from /examples/leds.js
// It's unclear what this is meant to do

var five = require("johnny-five");
var firmata = require("firmata");
var HID = require("node-hid");

// set up the input
var stdin = process.openStdin();
process.stdin.setRawMode(true);

var allDevices = HID.devices(0x416,0xffff);
if (allDevices.length < 1) {
  console.log("No HID devices available");
  process.exit(0);
}
console.log(allDevices);
var hiddev = new HID.HID(allDevices[0].path);

var io = new firmata.Board(hiddev);

var max_speed_l = 150;
var max_speed_r = 140;

var l_motor = null, r_motor = null;

var opts = {};
opts.io = io;
io.once('ready', function(){

    console.log('io ready');
    io.isReady = true;
    
    var board = new five.Board({io: io});
    var strip = null;

    var fps = 3; // how many frames per second do you want to try?

    board.on("ready", function() {

        l_motor = new five.Motor({pins: {pwm: 6, dir: 7}});
        r_motor = new five.Motor({pins: {pwm: 5, dir: 4}});

        console.info("Board connected. Robot set up. LRUD to control");

    });
});

stdin.on('keypress', function(chunk, key) {
	// process the keypresses

	if (key) {
		switch (key.name) {
			case "up":
                l_motor.reverse(max_speed_l);
                r_motor.forward(max_speed_r);
				break;
			case "down":
                r_motor.reverse(max_speed_r);
                l_motor.forward(max_speed_l);
				break;
			case "left":
                l_motor.forward(max_speed_l);
                r_motor.forward(max_speed_r);
				break;
			case "right":
                r_motor.reverse(max_speed_r);
                l_motor.reverse(max_speed_l);
				break;
			case "space":
                l_motor.stop();
                r_motor.stop();
				break;
		}
	}
});

