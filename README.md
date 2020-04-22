# Using your mBot as a NodeBot

[![Join the chat at https://gitter.im/Makeblock-official/mbot_nodebots](https://img.shields.io/badge/Gitter-Join%20Chat-brightgreen.svg)](https://gitter.im/Makeblock-official/mbot_nodebots?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
![](https://img.shields.io/badge/status-Stable-green.svg)

## Hardware [mbot](http://mblock.cc/) from [makeblock](http://www.makeblock.cc/)

> mBot is the easiest educational robot for kids to learn programming, Arduino and robotics.

![mbot](https://cloud.githubusercontent.com/assets/1183541/7513052/80e6dfc0-f4f4-11e4-94b8-76d3ee166cd2.jpg)

*Photo from [Andrew Fisher](https://twitter.com/ajfisher)*

## Getting started

### 1. Drivers

Install the USB Serial driver for your platform found in the `drivers` folder.
Windows users will need to reboot after installing the drivers.

If you're using linux you can skip this step. But instead you will need to add yourself to the `dialout` group using the command

```bash
sudo usermod -a dialout YOUR_USERNAME
```

You will need to restart or logout and in again afterwards.

### 2. Install Node.js

Install a recent version of [NodeJS](https://nodejs.org) installed (v10 is tested at the moment).

### 3. Build the bot

Build the bot according to the instructions in your kit

### 4. Install firmware using Interchange

We need to install the firmata firmware onto the board.

This fork uses a custom firmware, which combines the latest firmata (2.5.8), drivers for the WS2812 LED strips from [Node-Pixel](https://github.com/ajfisher/node-pixel), and the `mbotFirmata.ino` sketch from the original repository.

At this moment this custom firmware is only present in ./firmware/build/bluetooth. This is not the proper place and will be updated.

Open the sketch in Arduino IDE, connect your mBot via USB, compile and upload the sketch onto the board.

If you see `Error: no Arduino 'uno' found.`. Make sure the on/off switch is on. Also check you have the drivers installed properly. Did you forget to reboot? El Capitan users please make sure you installed the codebenderDriver version located in the driver directory.

If you see the `Error: Sending xxxx: receiveData timeout after 400ms`, try again after removing the bluetooth module. Replace it afterwards if you are following the bluetooth method.

If you see `There was an error downloading the manifest file.` try checking your internet connection. If all connectivity fails, ask someone to kindly install firmata for you.

If you see `Permission denied, cannot open /dev/ttyUSB0` double check you're in the dialout group and you restarted.

### 5. Install npm modules

Run `npm -i` to install third-party dependencies. This fork updates `johnny-five` and `node-pixel` to their latest versions.

On Windows, you could run into problems compiling native bindings. Make sure you have Windows build tools installed; if not, run:

```bash
npm install -g --production windows-build-tools --vs2015
```

Please be aware that as of 2020-04, you cannot run any code on your mBot under Windows Subsystem for Linux (WSL) using USB or Bluetooth. WSL does not have access to any peripherals. This might change in the future.

Due to a known bug in `node-pixel` v.0.10.2, it is necessary to patch the file `./node_modules/node-pixel/lib/pixel.js', line **94**:

```javascript
var port = firmata.transport || firmata;
```

Otherwise, you'll see `NoWritablePortError` when trying to access the LEDs. Hopefully this gets fixed soon and this notice will disappear.

## Examples

Time to play with some code. There are plenty of examples in the examples directory that you can learn from. You can run from a command line using the command `node examples/file.js`.

Once you're done with an example, close the program by pressing `Ctrl + c` twice.

### LEDs

Lets make the lights flash. There are 2 LEDs on the mbot which are RGB (Red Green Blue) NeoPixel LEDs. These are connected in a strip so you can use node-pixel to control them. An example is `examples/leds.js`

```bash
node examples/leds.js
```

Because we're using a custom firmware, it's also necessary to add `skip_firmware_check: true` to `StripOptions`, or you'll see `IncorrectFirmataVersionError`.

### Buzzer

Use `examples/piezo.js` - this will make your mbot play some tunes - note that
the latency of Bluetooth means this won't work over the bluetooth controller.

### Motors

Use `examples/motors.js` this will drive the mbot around using the arrow keys on
your keyboard. You may need to change the details of the directions depending on
how you wired up the motors.

This is not yet working.

### Obstacle detection

Use `examples/sonar.js` to detect the distance to an object. You can use this to
stop your robot from running into things.

### Button

Your mbot has a little button that you can use to trigger something maybe. Use
`examples/button.js` to detect the button press and do something with it.

This is not yet working.

### Light Sensor

You can read the light level near the mbot - maybe you can make your mbot
run away from too much light or move towards more light? Use `examples/light.js`

### Reflectance sensor

Under your mbot is a sensor which you can use to detect lines. Look at
`examples/reflectance.js` to see how to get the data. You can detect lines by
getting both sensors to detect a light or dark line (eg black tape on a light
surface). Once both sensors are on the line when one drifts off (eg the right
sensor) then you can steer back towards the line (turn back to the left in this
case).

Once you get this working you can build an effective line following bot.

## Bluetooth module

Below are instructions from the original repo. Not sure how much they apply.

To use the BT module do the following modifications:

* Remove the bluetooth module from the mBot
* Install the bluetooth firmata with instruction below

```bash
interchange install git+https://github.com/Makeblock-official/mbot_nodebots -a uno --firmata=bluetooth
```

* Turn the mbot off, install the bluetooth module, turn the board on again.
* Pair the module (use whatever tool you need to make that work for your OS -
usually BT settings in your control panel). It should be called `Makeblock`. Hopefully nobody else is pairing at the same time.

Test the connection by using a screen terminal such as:

```bash
screen /dev/tty.Makeblock-ELETSPP
```

If this connects you should see the blue LED on the BT module go solid. From there
hit the reset button on the board and then you should see something like the following
appear on your terminal.

```bash
��ymbotFirmata.ino��{�3��l�A�2�U�
```

If you don't get that, test your connection etc. If you do then proceed.

Now execute

```bash
node examples/leds.js /dev/tty.Makeblock-ELETSPP
```

And you should get blinking lights over BT. You can do the same thing with
most of the examples though speed may be an issue in high data rate cases.

## 2.4GHz wireless module

Install using:

```bash
npm install drivers/node-hid
```

Run example

```bash
node examples/wifi_motors.js
```

Admittedly this is not working for me.

## Toys

I took hints from the examples and started writing my own toys.

And, because writing untyped Javascript sucks, I introduced Typescript into the project. Luckily we have types for `johnny-five`, not so lucky with `node-pixel`, and so I've started drafting their type definitions (see the `./types` folder). Arguably it would make sense to do them properly and offer them to `node-pixel` as a PR.

The toys are in the `./toys` folder.

My goal is to build a toy that would make the mBot come alive, move and interact with me.