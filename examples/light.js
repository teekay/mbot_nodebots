// Light sensor example for mBot. Uses the light sensor at the front
// of the board which is on Analog pin 6 A6.
// The data event provides a value output for the analog value of the the
// light sensor in the range 0 (total darkness) to 1023 (full bright light).

var five = require("johnny-five");
var board = new five.Board({
  port: process.argv[2] || ""
});

board.on("ready", function() {

  var sensor = new five.Sensor({
    pin: "A6",
    freq: 500 // change this to speed you want data reported at. Slower is better
    // if the front LEDs are on, obviously this sensor will report max values
  });

  sensor.on("data", function() {
    console.log(this.value);
  });
});

