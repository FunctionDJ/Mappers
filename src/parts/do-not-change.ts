import { five } from "../atoms"
import prefix from "../functions/prefix"
import { Mapping } from "../mapping"

const attVals = [0, 6, 12]
const TOVals = [6, 12, 18, 24]

type sv = [string, any?] // string, value
type isv = [string, ...sv] // id, string, value

const s = (s: string, v?: any) => v === undefined ? `setting '${s}'` : `setting '${s}' '${v}'`
const d = (s: string, v?: any) => v === undefined ? `settings_setdefault '${s}'` : `settings_setdefault '${s}' '${v}'`

const lcd: isv[] = five.map((i): isv => [`LCD_BRIGHTNESS${i}`, "jogScreenBrightness", 20*i])

const jog: isv[] = ["Off", 33, 66, 100].map((v, i) => ["JOGRING_BRIGHTNESS_"+i, "jogRingBrightness", v])

const fxBrightness: isv[] = [33, 66, 100].map((v, i) => ["FX_BRIGHTNESS"+(i+1), "fxScreenBrightness", v])

const attentuators: isv[] = ["MASTER", "BOOTH"].flatMap((t): Mapping[] =>
  attVals.map((i): isv =>
    [t+"_ATTENUATOR_"+i, t.toLowerCase()+"OutputAttenuation", -i+"db"]
  )
)

const TOlevels: isv[] = TOVals.map((i): isv => ["TALKOVER_LEVEL_"+i, "micTalkOverLevel", -i+"db"])

const demoModes: isv[] = [
  ["OFF", "Off"],
  ["1MIN", "1Min"],
  ["5MIN", "5Mins"],
  ["10MIN", "10Mins"],
  ["SCRS", "ScrSaver"]
].map(([t, v]) => ["DEMOMODE_"+t, "demoMode", v])

const various: isv[] = [
  ["AUTO_STANDBY", "autoStandby"],
  ["MASTER_STEREO", "masterOutputStereo"],
  ["BOOTH_STEREO", "boothOutputStereo"],
  ["MASTER_LIMITER", "masterOutputLimiter"],
  ["MIC_TO_BOOTH", "micAudibleToBooth"],
  ["MIC_TOMASTER_LIMITER", "micToMasterLimiter"],
  ["MIC_BOOTH_LIMITER", "micToBoothLimiter"],
  ["MIC_TALKOVER_ADVANCED", "micTalkOverAdvanced"],
  ["FADER_START_ENABLE", "faderStart"],
]

const common: Mapping[] = [
  lcd, jog, demoModes, attentuators, TOlevels, fxBrightness, various
].flat()

const dncIn: Mapping[] = common
  .map(([i, ...r]: isv): Mapping => [i, d(...r)])
  .map(prefix("IN"))

const dncOut: Mapping[] = [
  ...common.map(([i, ...r]: isv): Mapping => [i, s(...r)]),
  ["CF_CUTLAG", s('crossfaderCutLag',)],
  ["SLIP_MODE_FLASH", s('slipModeFlash',)],
  ["SLIP_BUTTON_FLASH", s('slipButtonLed', 'Blink')]
].map(prefix("OUT"))

const doNotChange: Mapping[] = [
  ["MODE", "blink 200ms"],
  ["SHOWBEATS", s("jogScreenShowBeats")],
  ["SHOWCOVER", s("jogScreenShowCover")],
  ["NEEDLE_WHITE", "load_pulse 20ms ? slip_mode ? off : play ? on : cue ? on : off"],
  ["NEEDLE_RED", "play ? vinyl_mode ? touchwheel_touch : off : loaded ? cue ? off : on : off"],
  ["NEEDLE_YELLOW", "loaded ? slip_mode : off"],
  ["ON", "on"],
  ["LOADED", "loaded"],
  ["LOAD_PULSE", "load_pulse 20ms"],
  ["LOOP_WAVECOLOR_WHITE", "loop_load_prepare ? param_bigger 0 loop_position 0 ? off : on : loop ? off : on"],
  ...dncIn,
  ...dncOut,
  ["SLIP_BLINK", `slip_mode`]
].map(prefix("DNC"))

export default doNotChange