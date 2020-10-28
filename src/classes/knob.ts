import { Renderable } from "../main";
import { Mapping } from "../mapping";

export class Knob implements Renderable {
  private _push?: string;
  private _twist?: string;
  private _shiftTwist?: string;
  private _shiftPush?: string;

  constructor(private name: string) { }

  getMappings(): Mapping[] {
    const result: Mapping[] = [
      [this.name, this._twist ?? ""]
    ];

    if (this._push) {
      result.push([this.name + "_PUSH", this._push]);
    }

    if (this._shiftTwist) {
      result.push(["SHIFT_" + this.name, this._shiftTwist]);
    }

    if (this._shiftPush) {
      result.push(["SHIFT_" + this.name + "_PUSH", this._shiftPush]);
    }

    return result;
  }

  public twist(twist: string) {
    this._twist = twist;
    return this;
  }

  public push(push: string) {
    this._push = push;
    return this;
  }

  public shiftPush(shiftPush: string) {
    this._shiftPush = shiftPush;
    return this;
  }

  public shiftTwist(shiftTwist: string) {
    this._shiftTwist = shiftTwist;
    return this;
  }
}
