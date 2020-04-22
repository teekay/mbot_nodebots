// Uses proximity sensor on the front to tell the distance from the object
// Assumes prox sensor is plugged into port 2 - if not change the pin to use
// the pin for appropriate port and the second pin within it.

var five = require("johnny-five");
var opts = {};
opts.port = process.argv[2] || "";
var board = new five.Board(opts);

board.on("ready", function() {
  var proximity = new five.Proximity({
    freq: 1000,
    controller: "HCSR04",
    pin: 17 // see the pin mapping https://github.com/Makeblock-official/mBot_Firmata/blob/master/nodejs/mbot.js
  });

  proximity.on("data", function() {
    console.log("inches: ", this.inches);
    console.log("cm: ", this.cm);
  });
});
