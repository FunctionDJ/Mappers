import prefix from "../functions/prefix"
import { Mapping } from "../mapping"

const data: Mapping[] = [
  ["COVER", "cover", "1002"],
  ["WAVEFORM", "waveform", "2002"],
  ["BEATGRID", "beatgrid", "2002"],
  ["CUEPOINTS", "cuepoints", "1002"],
  ["BPMANCHORS", "beatanchors"]
].map(([id, getter, value]): Mapping =>
  [id, value === undefined ? `get_pioneer_display "${getter}"` : `get_pioneer_display "${getter}" ${value}`]
).map(prefix("DATA"))

export default data