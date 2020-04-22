// Connects to your mbot on the provided port
// lighting its 2 front LEDs with random color
// first at specified FPS, then randomly slowing down or speeding up at random intervals
import _ from "lodash";
import { Mbot } from "../model/mbot";
import { Strip } from "node-pixel";

let blinkingFrequency: NodeJS.Timeout;
let changeFrequency: NodeJS.Timeout;
let realFps: number;

export function run(port?: string, fps?: number): void {
  const bot = new Mbot();
  bot.PowerUp(_.partial(setUpLedStrip, bot, +(fps || 3)), port);
}

function setUpLedStrip(bot: Mbot, fps: number): void {
  console.log("Board ready, lets add light");
  const strip = bot.LedStrip();
  strip.on("ready", _.partial(setUpBlinker, strip, fps));
}

function setUpBlinker(strip: Strip, fps: number): void {
  console.log("Strip ready, let's go");
  console.log("Press Ctrl + c twice to quit.");
  setUpChangingFrequency(strip, fps);
}

function setUpChangingFrequency(strip: Strip, fps: number): void {
  clearInterval(changeFrequency);
  const duration = _.random(4, 12, false);
  letBlinkerBlink(strip, fps, duration);
  changeFrequency = setInterval(_.partial(setUpChangingFrequency, strip, fps), duration * 1000);
}

function letBlinkerBlink(strip: Strip, fps: number, duration?: number): void {
  realFps = _.isUndefined(realFps) 
    ? fps
    : Math.max(1, Math.min(10, realFps + oneOrNegativeOne()))
  console.log(`Blinking at ${realFps} FPS for ${duration || '?'} seconds`);
  clearInterval(blinkingFrequency);
  blinkingFrequency = setInterval(_.partial(blinker, strip), 1000/realFps);
}

function oneOrNegativeOne(): number {
  const x = _.random(-1, 1, false);
  return x !== 0 ? x : oneOrNegativeOne();
}
  
function blinker(strip: Strip): void {
  strip.color("#000"); // blanks it out
  _.range(0, strip.length)
    .forEach(x => strip.pixel(x).color(randomColor()));
  strip.show();
}

export function randomColor(): string {
  const rand = () => _.random(0, 255, false);
  return `#${toHex(rand())}${toHex(rand())}${toHex(rand())}`;
}

function toHex(n: number): string {
  if (isNaN(n)) return "00";
  const hexes = "0123456789ABCDEF"
  let num = Math.max(0,Math.min(n,255));
  return hexes.charAt((num-num%16)/16) + hexes.charAt(num%16);
}
    