const fs = require("fs").promises
const xml = require("xml2js");

/** @param {string} anyString */
const s = anyString => anyString.split("\n").join(" ").trim().replace(/\s+/g, " ")

;(async () => {
  const contents = await fs.readFile(__dirname + "/Pioneer DDJ-1000 - Custom.xml.old", {
    encoding: "utf-8"
  })

  const obj = await xml.parseStringPromise(contents, {
    attrkey: "props",
    charkey: "value"
  })

  const mapsArray = obj.mapper.map

  const findAndModify = (label, callback) => {
    const map = mapsArray.find(map => map.props.value === `LED_PAD_MODE_${label}`)
    map.props.action = s(callback(map.props.action))
  }

  const pingpongBase = "deck active get_beat_bar & param_mod 0.25 & param_multiply 4 & param_pingpong & param_multiply 8 & param_cast 'integer'"
  
  const getPingpong = (yellowStart, violetStart) => `
    leftdeck ?
      ${pingpongBase} & param_equal ${yellowStart} ?
        color 'yellow'
        : ${pingpongBase} & param_equal ${violetStart} ?
          color 'violet'
          : off
      : ${pingpongBase} & param_equal ${8 - yellowStart} ?
        color 'yellow'
        : ${pingpongBase} & param_equal ${8 - violetStart} ?
          color 'violet'
          : off
  `

  const passPrev = p5Action =>
    prevAction => `pad_pages 5 ? ${p5Action} : ${prevAction}`

  const pingponger = (label, yellow, violet) =>
    findAndModify(label, passPrev(getPingpong(yellow, violet)))

  pingponger("HOTCUE", 0, 1)
  pingponger("PADFX1", 1, 2)
  pingponger("BEATJUMP", 2, 3)
  pingponger("SAMPLER", 3, 4)

  findAndModify("KEYBOARD", () => `
    pad_pages 5 ? ${getPingpong(0.1, 0.2, 0.3)} : off
  `)

  const builder = new xml.Builder({
    attrkey: "props",
    charkey: "value",
    xmldec: {
      version: "1.0",
      encoding: "UTF-8"
    }
  })

  fs.writeFile(__dirname + "/Pioneer DDJ-1000 - Custom.xml", builder.buildObject(obj))
})()