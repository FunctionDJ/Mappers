import { Builder } from "xml2js"
import { Mapping } from "./mapping"

const builder = new Builder({
  rootName: "mapper",
  explicitRoot: true,
  headless: true
})

export default (maps: Mapping[]) => builder.buildObject({
  $: {
    device: "DDJ1000",
    author: "Atomix Productions",
    version: 850,
    date: "2020-09-25"
  },
  info: {
    _: "http://www.virtualdj.com/manuals/hardware/pioneer/ddj1000.html"
  },
  map: maps.map(([value, action]) => ({ $: { value, action } }))
})