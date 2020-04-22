declare module "node-pixel" {
  export enum COLOR_ORDER {
    GRB = 0x00,
    RGB = 0x01,
    BRG = 0x02
  }
      
  export const SHIFT_FORWARD = 0x20;
  export const SHIFT_BACKWARD = 0x00;

  export interface LedStrip {
    pin: number;
    length: number;
  }

  export interface StripOptions {
    controller: string;
    board: any;
    strips: LedStrip[];
    gamma?: number;
    skip_firmware_check?: boolean;
  }

  export class Strip {
    constructor(opts: StripOptions);

    length: number;
    gamma: number;
    gtable: number[];

    pixel(addr: number): Pixel;
    color(hex: string): void;
    on(eventName: string, callback: Function): void;
    stripLength(): number;
    show(): void;
    off(): void;
  }

  export interface Color {
    r: number;
    g: number;
    b: number;
    hexcode: string;
    color: string;
    rgb: number[];
  }

  export interface Pixel {
    address: string;
    id: string;
    //color: Color;
    firmata: string;
    port: string;
    parent: Pixel;

    color(hex: string): void;
  }
}

