// Connects to your mbot on the provided port
// lighting its 2 front LEDs with random color
// when it feels your hand approaching, it lights up faster and backs off
// when not, it will dare to take a step forward
import _ from "lodash";
import { Mbot, Wheels } from "../model/mbot";
import moment from "moment";
import { Strip } from "node-pixel";
import { ProximityData } from "johnny-five";
import repl = require("repl");

let blinkingFrequency: NodeJS.Timeout;
let changeFrequency: NodeJS.Timeout;
let ledStrip: Strip;
let wheels: Wheels;
let lastTimeBackedOff: Date = new Date();
let lastCreeped: Date = new Date();
let cmd: repl.REPLServer;
const proximityData: number[] = [];

export function run(port?: string): void {
  cmd = repl.start();
  cmd.on("exit", dispose);
  const bot = new Mbot();
  bot.PowerUp(_.partial(main, bot), port);
}

function main(bot: Mbot): void {
  console.log("Board ready");
  console.log("Press ESC to quit, Ctrl + c twice to kill this thing.");
  ledStrip = bot.LedStrip();
  ledStrip.on("ready", _.partial(monitorProximity, ledStrip));
  const sonar = bot.Sonar(2000);
  sonar.on("data", onPromixityChanged);
  wheels = new Wheels();
}

function dispose(): void {
  // For some reasons the commands below do not work
  // Could it be that they are being invoked after the Board has closed already?
  wheels.stop();
  clearInterval(changeFrequency);
  clearInterval(blinkingFrequency);
  ledStrip.off();
  ledStrip.show();
  console.log("Thanks for playing!");
}

function onPromixityChanged(pd: ProximityData) {
  proximityData.unshift(pd.cm);
  if (proximityData.length > 1000) {
    proximityData.pop();
  }
}

function monitorProximity(strip: Strip): void {
  clearInterval(changeFrequency);
  letBlinkerBlink(strip, fpsForDistance(proximityData.slice(0, 10)));
  changeFrequency = setInterval(_.partial(monitorProximity, strip), 500);
}

function fpsForDistance(distances: number[]): number {
  const minFps = 2, panicAtCm = 4, ignoreAtCm = 20;
  if (distances.length < 5) return minFps;
  const probableDistance = Math.floor(_.sum(distances) / distances.length);
  const effectiveDistance = Math.max(panicAtCm, Math.min(ignoreAtCm, probableDistance));
  const fps = Math.round((ignoreAtCm + panicAtCm - effectiveDistance) / 2);
  //console.log(`Probable distance: ${probableDistance}, fps: ${fps}`);
  return fps;
}

function letBlinkerBlink(strip: Strip, fps: number): void {
  //console.log(`Blinking at ${fps} FPS`);
  clearInterval(blinkingFrequency);
  blinkingFrequency = setInterval(_.partial(blinker, strip), 1000/fps);
  const secondsFromLastBackoff = moment().diff(moment(lastTimeBackedOff), "seconds");
  const secondsFromLastCreep = moment().diff(moment(lastCreeped), "seconds");
  if (fps > 6 && secondsFromLastBackoff >= 1) {
    wheels.backOff(120, 400);
    lastTimeBackedOff = new Date();
  }
  if (fps === 2 && secondsFromLastBackoff > 1 && secondsFromLastCreep > _.random(5, 15, false)) {
    wheels.creepForward(150, 600);
    lastCreeped = new Date();
  }
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
    