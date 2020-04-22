import _ from "lodash";
import { Board, Proximity, Motor } from "johnny-five";
import { Strip } from "node-pixel";

export class Mbot {
  constructor() {
  }

  private board?: Board;

  PowerUp(callback: () => void, port?: string): void {
    this.board = new Board({
      port: port || ""
    });
    this.board.on("ready", callback);
  }

  /**
   * Returns the strip of 2 LEDs up front
   * mbot maps WS2812 pixels in a 2 pixel strip attached to pin 13.
   */
  LedStrip(): Strip {
    return new Strip({
      strips: [{ pin: 13, length: 2, }],
      gamma: 1.0,  
      board: this.board,
      controller: "FIRMATA",
      skip_firmware_check: true
    });
  }

  Sonar(frequency?: number): Proximity {
    return new Proximity({
      freq: frequency || 1000,
      controller: "HCSR04",
      pin: 17
    });
  }
}

export class Wheels {
  constructor() {
    this.leftMotor = new Motor({pins: {pwm: 6, dir: 7}});
    this.rightMotor = new Motor({pins: {pwm: 5, dir: 4}});
  }

  private leftMotor: Motor;
  private rightMotor: Motor;

  public backOff(speed: number, timeOut: number): void {
    this.leftMotor.forward(speed);
    this.rightMotor.reverse(speed);
    setTimeout(this.stop.bind(this), timeOut);
  }

  public creepForward(speed: number, timeOut: number): void {
    this.leftMotor.reverse(speed);
    this.rightMotor.forward(speed);
    setTimeout(this.stop.bind(this), timeOut);
  }

  public stop(): void {
    this.leftMotor.stop();
    this.rightMotor.stop();
  }
}