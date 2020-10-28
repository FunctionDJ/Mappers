import prefix from "../functions/prefix"
import { Mapping } from "../mapping"

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
  ["JOGRING", `param_bigger 0.4 get_beat2 ? blink 100ms`],
].map(prefix("DIGIT"))

export default digits