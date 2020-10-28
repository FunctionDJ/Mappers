import { Renderable } from "../main";
import { Mapping } from "../mapping";

export class HD implements Renderable {
  private _action?: string | boolean;
  private _hd: string = "";
  private _shift: string = "";

  constructor(private name: string) { }

  public getMappings(): Mapping[] {
    const result: Mapping[] = [];

    if (this._hd) {
      result.push(["HD_" + this.name, this._hd]);
    }

    if (this._action) {
      result.push([
        this.name,
        typeof this._action === "boolean"
          ? "var '$DDJ1K_HID' ? nothing : " + this._hd
          : this._action
      ]);
    }

    if (this._shift) {
      result.push(["SHIFT_" + this.name, this._shift]);
    }

    return result;
  }

  public action(action: string) {
    this._action = action;
    return this;
  }

  public hd(hd: string) {
    this._hd = hd;
    this._action = true;
    return this;
  }

  public shift(shift: string) {
    this._shift = shift;
    return this;
  }
}
