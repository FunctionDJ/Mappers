import { Renderable } from "../main";
import { Mapping } from "../mapping";

export class Button implements Renderable {
  private _push?: string;
  private _shiftPush?: string;
  private _led?: string;
  private _shiftLed?: string;
  private _hd?: string;

  constructor(private name: string) { }

  getMappings(): Mapping[] {
    const result: Mapping[] = [];

    if (this._hd) {
      result.push([this.name, "var '$DDJ1K_HID' ? nothing : " + this._hd]);

      if (this._shiftPush) { // this is dumb
        result.push(["SHIFT_" + this.name, "var '$DDJ1K_HID ? nothing : " + this._shiftPush]);
      }

      return result;
    }

    if (this._push) {
      result.push([this.name, this._push]);
    }

    if (this._shiftPush) {
      result.push(["SHIFT_" + this.name, this._shiftPush]);
    }

    if (this._shiftLed) {
      result.push(["LED_SHIFT_" + this.name, this._shiftLed]);
    }

    if (this._led) {
      result.push(["LED_" + this.name, this._led]);
    }

    return result;
  }

  public push(push: string) {
    this._push = push;
    return this;
  }

  public shift(shiftPush: string) {
    this._shiftPush = shiftPush;
    return this;
  }

  public led(led: string) {
    this._led = led;
    return this;
  }

  public hd(hd: string) {
    this._hd = hd;
    return this;
  }

  public shiftLed(shiftLed: string) {
    this._shiftLed = shiftLed;
    return this;
  }
}
