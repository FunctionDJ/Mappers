export const four = [1, 2, 3, 4]
export const five = [...four, 5]
export const sixteen = Array(16).fill(1).map((_v, i) => i+1)

export const pages = [
  "HOTCUE",
  "PADFX1",
  "BEATJUMP",
  "SAMPLER",
  "KEYBOARD",
  "PADFX2",
  "BEATLOOP",
  "KEYSHIFT"
]

export const layers = {
  "": { action: "", pageAddition: "" },
  "SHIFT_": { action: "shift", pageAddition: "2" }
}

export const types = [
  ["", ""],
  ["LED_", "_button_color"]
]

export const pm = ["+", "-"]