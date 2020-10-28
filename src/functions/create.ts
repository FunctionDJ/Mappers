import { Button } from "../classes/button"
import { HD } from "../classes/hd"
import { Knob } from "../classes/knob"

export const createButton = (name: string) => new Button(name)
export const createKnob = (name: string) => new Knob(name)
export const createHD = (name: string) => new HD(name)