import { createButton } from "../functions/create"
import { Renderable } from "../main"

export default (...additions: Renderable[]): Renderable[] => [
  ...additions,
  createButton("PFL").push("pfl").shift("beat_tap"),
  createButton("PLAY_PAUSE").push("pioneer_play").shift("play_stutter"),
  createButton("SLIP").push("slip_mode").shift("vinyl_mode").led("slip_mode ? get_slip_active ? blink 500ms : on : off"),
  createButton("SYNC")
    .push("sync & set 'syncdown' 1 while_pressed")
    .shift("holding ? masterdeck_auto : masterdeck")
    .led("var 'syncdown'")
    .shiftLed("masterdeck"),
  createButton("MASTER_TEMPO").push("master_tempo").shift('pitch_range "6,10,16,100" +1'),
  createButton("MEMORY").push("loop_load").shift("loop_load"),
  createButton("SLIP_REVERSE")
    .push("dump while_pressed").led("reverse ? dump ? on : blink 500ms : off")
    .shift("reverse").shiftLed("reverse ? dump ? on : blink 500ms : off"), // odd duplication
  createButton("LOOP_IN")
    .push("loop ? loop_adjust 'in' ? loop_adjust 'in' : loop_half : pioneer_loop_in").led("loop_adjust 'in' ? blink 300ms : pioneer_loop_in")
    .shift("loop_adjust 'in'").shiftLed("loop_adjust 'in'"),
  createButton("LOOP_OUT")
    .push("loop ? loop_adjust 'out' ? loop_adjust 'out' : loop_double : pioneer_loop_out").led("loop_adjust 'out' ? blink 300ms : pioneer_loop_out")
    .shift("loop ? loop_adjust 'out' : reloop").shiftLed("loop_adjust 'out'")
]