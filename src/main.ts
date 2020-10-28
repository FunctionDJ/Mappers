import build from "./build"
import { createButton, createHD, createKnob } from "./functions/create"
import { Mapping } from "./mapping"
import data from "./parts/data"
import doNotChange from "./parts/do-not-change"
import getRenderables from "./parts/get-renderables"
import { promises as fs } from "fs"
import { four, layers, pages, pm, sixteen, types } from "./atoms"

const prefix = (text: string) => (([v, a]: string[]): Mapping => [text+"_"+v, a])

const passives: Mapping[] = [
  ["ONINIT", "fake_master on & fake_hp on & fake_hpmix on"],
  ["ONEXIT", "fake_master off &amp; fake_hp off &amp; fake_hpmix off"]
]

const ledPageAdditions: Mapping[] = [
  ["LED_HOTCUE_PAGE+", "var 'hc_page' 1"],
  ["LED_HOTCUE_PAGE-", "var 'hc_page' 0"]
]

const correct = (i: number) => ((i - 1) % 8) + 1

const pageButtons: Mapping[] = []

for (const page of pages) {

  for (const { action } of Object.values(layers)) {
    for (const operator of pm) {
      pageButtons.push([
        `${action + page}_PAGE${operator}`,
        `pad_param ${operator}1`
      ])
    }
  }

  for (const [layer, { action }] of Object.entries(layers)) {

    for (const [type, typeAction] of types) {
      for (const i of sixteen) {
        pageButtons.push([
          layer + type + page + "_PAD" + i,
          "pad" + action + typeAction + " " + correct(i)
        ])
      }
    }

  }
}

// const pageButtons: Mapping[] = pages
//   .flatMap(page =>
//     Object.entries(layers).flatMap(([layer, { action, pageAddition }]) =>
//       [
//         ...pm.flatMap((o) =>
//           types.map(([type]): Mapping =>
//             [`${layer + type}PAGE${o}`, `pad_param${pageAddition} ${o}1`]
//           )
//         ),
//         ...types.flatMap(([type, typeAction]) =>
//           sixteen.map((i): Mapping =>
//             [layer + type + page + "_PAD" + i, "pad" + action + typeAction + " " + correct(i)]
//           )
//         )
//       ]
//     )
//   )

const digits: Mapping[] = [
  ["TIME_REMAIN", `setting 'timeDisplay' 'Remain'`],
  ["ONAIR", `get_volume & param_bigger 0 ? on : off`],
  ["PITCHRANGE", `pitch_range 6% ? constant 1 : pitch_range 10% ? constant 2 : pitch_range 16% ? constant 3 : pitch_range 100% ? constant 4`],
  ["MASTER", `loaded ? masterdeck : off`],
  ["SYNC", `is_sync`],
  ["LOOPSIZE", `get_pioneer_loop_display`],
  ["TIME_SIGN", `get_time_sign "elapsed" & param_smaller 0 ? constant 1 : constant 0`],
  ["TIME_MIN", `get_time_min 'elapsed' 'absolute' 256`],
  ["TIME_SEC", `get_time_sec 'elapsed' 'absolute'`],
  ["TIME_MSEC", `get_time_ms 'elapsed' 'absolute' & param_multiply 10`],
  ["TOTALTIME_MIN", `get_time_min 'total' 'absolute' 256`],
  ["TOTALTIME_SEC", `get_time_sec 'total' 'absolute'`],
  ["TOTALTIME_MSEC", `get_time_ms 'total' 'absolute' & param_multiply 10`],
  ["BPM", `get_bpm & param_cast 'int_trunc'`],
  ["BPM_DEC", `get_bpm & param_cast 'frac' & param_multiply 10`],
  ["BPM_LARGE", `get_bpm & param_cast 'int_trunc' & param_multiply 0,00390625 & param_cast 'int_trunc'`],
  ["TEMPO", `get_pitch`],
  ["LOOPIN", `get_loop_in_time on`],
  ["LOOPOUT", `get_loop_out_time on`],
  ["CUE_PROGRESS_MARKER_POS", `cue_pos 0 'mseconly'`],
  ["CUE_JOG_MARKER_POS", `cue_pos 0 'mseconly'`],
  ["CUE_JOG_MARKER_COLOR_MODE", `constant 3`],
  ["CUE_JOG_MARKER_COLOR", `cue_color 0 ? cue_color 0 : color 'yellow'`],
  ["KEY_VAL", `get_key 'pioneer'`],
  ["KEY_DIFF", `get_key_modifier & param_cast 'integer' & param_add 13`],
  ["JOGRING", `load_pulse ? setting 'jogBlinkWarning' ? play ? songpos_remain 10000ms ? blink 250ms : songpos_remain 20000ms ? blink 500ms : songpos_remain 30000ms ? blink : on : on : on : off`],
].map(prefix("DIGIT"))
  
const padModes: Mapping[] = pages.flatMap((page, i): Mapping[] =>
  types.map((type): Mapping =>
    [
      type[0] + "PAD_MODE_" + page,
      type.length === 0
        ? `pad_pages ${++i}`
        : `pad_pages ${++i}`
    ]
  )
)

const singleFx = (fx: string) => `deck master effect_select '${fx}' & effect_select 'sampler' '${fx}' & deck all effect_select '${fx}'`
const mobiusFx = (action: string) => `deck master effect_button 'mobius' 2 ${action} & deck all effect_button 'mobius' 2 ${action} & effect_button 'sampler' 2 ${action}`

const fxSel = {
  LOWCUT: singleFx("filter hp"),
  ECHO: singleFx("echo"),
  DELAY: singleFx("delay"),
  SPIRAL: singleFx("spiral"),
  REVERB: singleFx("reverb"),
  TRANS: singleFx("cut"),
  ENIGMA: singleFx("distortion"),
  FLANGER: singleFx("flanger"),
  PHASER: singleFx("phaser"),
  PITCH: singleFx("pitch"),
  SLIPROLL: singleFx("flippin double"),
  ROLL: singleFx("loop roll"),

  MOBIUSSAW: singleFx("mobius") + " & " + mobiusFx("on"),
  MOBIUSTRI: singleFx("mobius") + " & " + mobiusFx("off")
}

const cfxInfo = {
  ECHO: 1,
  NOISE: 3,
  PITCH: 3,
  FILTER: 4
}

const checksIntoActivate = (cfx: number) => four
  .filter(i => i !== cfx)
  .map(i => `var_equal '$CFX${i}' 1`)
  .join(" ? nothing : ")

const cfx: Mapping[] = Object.entries(cfxInfo)
  .map(([name, cfx]) => ["COLOR_FX_"+name, `toggle '$CFX${cfx}' & var_equal '$CFX${cfx}' 1 ? deck all filter_selectcolorfx '${name.toLowerCase()}' & deck all filter_activate : ${checksIntoActivate(cfx)} ? nothing : deck all filter_activate`])

const fxAssign: Mapping[] = ["MST", ...four, "MIC", "SP"].map((id, i) =>
  [String(id), `set '$ddjfx_ch' ${i} & deck master effect_active off & effect_active 'sampler' off & deck all effect_active off`]
).map(prefix("ASSIGN"))

const cfMap = {
  A: "left",
  B: "right",
  THRU: "thru"
}

const cfAssign: Mapping[] = Object.entries(cfMap)
  .map(([t, v]) => ["CF_ASSIGN_"+t, `cross_assign '${v}'`])

const textFx: Mapping[] = [
  ["NAME", `deck master get_effect_name & param_uppercase & param_cast 'text' 9`],
  ["BEATS", `deck master effect_beats ? effect_beats 'short' : get_effect_slider_text 1 & paramcast 'text' '4'`],
  ["BPM", `var '$ddjfx_ch' 1 ? deck 1 get_bpm : var '$ddjfx_ch' 2 ? deck 2 get_bpm : var '$ddjfx_ch' 3 ? deck 3 get_bpm : var '$ddjfx_ch' 4 ? deck 4 get_bpm : var '$ddjfx_ch' 5 ? nothing : deck master get_bpm`]
].map(prefix("TEXT_FX"))

const fx = [
  ...Object.entries(fxSel).map(prefix("SEL")),
  ...fxAssign,
  ...["+", "-"].map(o =>
    ["BEATS"+o, `deck master effect_beats ${o}1 & effect_beats 'sampler' ${o}1 & deck all effect_beats ${o}1`]
  ),
  ["LEVEL", "shift ? deck master effect_slider 2 & effect_slider 'sampler' 2 & deck all effect_slider 2 : deck master effect_slider 1 & effect_slider 'sampler' 1 & deck all effect_slider 1"],
  ["ON", "set '$ddj1k_fxon' & var '$ddjfx_ch' 1 ? deck 1 effect_active : var '$ddjfx_ch' 2 ? deck 2 effect_active : var '$ddjfx_ch' 3 ? deck 3 effect_active : var '$ddjfx_ch' 4 ? deck 4 effect_active : var '$ddjfx_ch' 5 ? nothing : var '$ddjfx_ch' 6 ? effect_active 'sampler' : deck master effect_active"]
].map(prefix("FX"))

const eq: Mapping[] = ["HIGH", "LOW", "MID"].map(n =>
  ["EQ_"+n, "eq_" + n.toLowerCase()]
)

const decks: Mapping[] = four.map(i =>
  ["DECK_"+i, `deck ${i} ${i % 2 ? "left" : "right"}deck`]
)

export interface Renderable {
  getMappings(): Mapping[]
}


const fourBeat2 = createButton("4BEAT_LOOP")
  .push("loop ? loop_exit : loop 4")
  .shift("reloop_exit")
  .led("loop")

const browseKnob = createKnob("BROWSE_ENC")
  .twist("browser_scroll")
  .shiftTwist("browser_scroll")
  .push("browser_window 'folders' ? browser_window 'songs' : doubleclick ? clone_from_deck : load")
  .shiftPush("browser_zoom")

const back = createButton("BACK")
  .push("browser_window 'folders' ? browser_folder : browser_window 'folders'")
  .shift("playlist_add")

const cue = createButton("CUE")
  .push("pioneer_cue")
  .shift("goto_start")

const jogParts = [
  createHD("JOG").hd("touchwheel").shift("touchwheel_touch 'search'"),
  createHD("JOG_TOUCH").hd("touchwheel_touch").shift("touchwheel_touch 'search'"),
  createButton("JOG_VINYL").hd("touchwheel"),
  createButton("JOG_SEARCH").hd("touchwheel"),
  createButton("JOG_OUT_RING").hd("touchwheel").shift("touchwheel_touch 'search'"),
  createButton("JOG_CD").hd("touchwheel")
]

const hds = [
  createHD("CROSSFADER").hd("crossfader"),
  createHD("VOLUME").action("level").hd("volume"),
  createHD("SHIFT").action("shift"),
  createHD("DDJ1K").action("set '$DDJ1K_HID' 1")
]

console.log(hds[0].getMappings())

const search = [
  ...pm.map(o => createButton("SEARCH"+o).push(`seek ${o}4`).shift(`seek ${o}16`)),
  ...pm.map(o => createButton("SEARCH_LONG"+o).push(`seek ${o}4`))
]

const view = [
  createButton("VIEW").push("browser_window 'sideview,songs'").shift("sideview +1"),
  createButton("VIEW_LONG").push("show_splitpanel 'info'")
]

const renderables = getRenderables(
  fourBeat2,
  browseKnob,
  back,
  cue,
  ...jogParts,
  ...hds,
  ...search,
  ...view,
)

const allMappings: Mapping[] = [
  ...passives,
  ...doNotChange,
  ...pageButtons,
  ...ledPageAdditions,
  ...digits,
  ...data,
  ...padModes,
  ...fx,
  ...textFx,
  ...cfx,
  ...decks,
  ...eq,
  ["LED_FX_ON_2", "var '$ddjfx_ch' 1 ? deck 1 effect_active : var '$ddjfx_ch' 2 ? deck 2 effect_active : var '$ddjfx_ch' 3 ? deck 3 effect_active : var '$ddjfx_ch' 4 ? deck 4 effect_active : var '$ddjfx_ch' 5 ? nothing : var '$ddjfx_ch' 6 ? effect_active 'sampler' : deck master effect_active"],
  ...cfAssign,
  ["FADER_START_CUE", "loaded ? stop : nothing"],
  ["FADER_START_PLAY", "loaded ? play : nothing"],

  ["COLOR_FX_PARAM", `filter`],
  ["GAIN", `gain`],
  ["HEADPHONES_MIX", "headphone_mix"],
  ["HEADPHONES_VOL", "headphone_volume"],
  ["KEY_RESET", "key 0"],
  ["KEY_SYNC", "match_key"],
  ["MASTER_VOL", "master_volume"],
  ["PFL_SAMPLER", "setting 'samplerHeadphones'"],
  ["PITCH", "pitch 'dual'"],
  ["QUANTIZE", "quantize_all"],
  ["SAMPLER_VOL", "sampler_volume_master"],
  ["SOURCE_LINE", "set 'linech' 1 & mute on"],
  ["SOURCE_USBA", "var_equal '$USB_PORT' 0 ? set 'linech' 0 & mute off : set 'linech' 1 & mute on"],
  ["SOURCE_USBB", "var_equal '$USB_PORT' 1 ? set 'linech' 0 & mute off : set 'linech' 1 & mute on"],
  ["USB_PORT_A", "set '$USB_PORT' 0"],
  ["USB_PORT_B", "set '$USB_PORT' 1"],
  ["VU_METER", "get_level"],
  ...renderables.flatMap((r): Mapping[] => r.getMappings())
]

const xml = build(allMappings).replace(/'/gm, "&apos;")

const sortAlphabetically = (a: string, b: string) => b > a ? -1 : 0

;(async () => {
  // const defaultXML = await fs.readFile(path.resolve(__dirname, "../Pioneer DDJ-1000 - Default.xml"), {
  //   encoding: "utf-8"
  // })

  const generatedSorted = xml.split("\n").sort(sortAlphabetically).join("\n")
  // const defaultSorted = defaultXML.split("\n").sort(sortAlphabetically).join("\n")

  fs.writeFile("./generated.xml", generatedSorted)
  // fs.writeFile("./default.xml", defaultSorted)
})()