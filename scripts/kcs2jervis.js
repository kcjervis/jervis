/* eslint-disable no-control-regex */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-undef */

// JSONCrush by Frank Force [MIT] https://github.com/KilledByAPixel/JSONCrush
{
  function JSONCrush(e) {
    let t = []
    const n = "-_.!~*'()"

    for (let e = 127; --e; )
      ((e >= 48 && e <= 57) || (e >= 65 && e <= 90) || (e >= 97 && e <= 122) || n.includes(String.fromCharCode(e))) &&
        t.push(String.fromCharCode(e))
    for (let e = 32; e < 255; ++e) {
      let n = String.fromCharCode(e)
      "\\" == n || t.includes(n) || t.unshift(n)
    }
    const l = ((e, t) => {
      let n = t.length,
        l = ""
      const r = e => encodeURI(encodeURIComponent(e)).replace(/%../g, "i").length,
        o = e => {
          let t = e.charCodeAt(0),
            n = e.charCodeAt(e.length - 1)
          return (t >= 56320 && t <= 57343) || (n >= 55296 && n <= 56319)
        }
      let i = {}
      for (let t = 2; t < 50; t++)
        for (let n = 0; n < e.length - t; ++n) {
          let l = e.substr(n, t)
          if (i[l]) continue
          if (o(l)) continue
          let r = 1
          for (let o = e.indexOf(l, n + t); o >= 0; ++r) o = e.indexOf(l, o + t)
          r > 1 && (i[l] = r)
        }
      for (;;) {
        for (; n-- && e.includes(t[n]); );
        if (n < 0) break
        let o,
          f = t[n],
          s = 0,
          c = r(f)
        for (let e in i) {
          let t = i[e],
            n = (t - 1) * r(e) - (t + 1) * c
          l.length || (n -= r("")), n <= 0 ? delete i[e] : n > s && ((o = e), (s = n))
        }
        if (!o) break
        ;(e = e.split(o).join(f) + f + o), (l = f + l)
        let u = {}
        for (let t in i) {
          let n = t.split(o).join(f),
            l = 0
          for (let t = e.indexOf(n); t >= 0; ++l) t = e.indexOf(n, t + n.length)
          l > 1 && (u[n] = l)
        }
        i = u
      }
      return { a: e, b: l }
    })((e = JSONCrushSwap((e = e.replace(new RegExp("", "g"), "")))), t)
    let r = l.a
    return l.b.length && (r += "" + l.b), encodeURIComponent(r)
  }

  function JSONCrushSwap(e, t = 1) {
    const n = [
        ['"', "'"],
        ["':", "!"],
        [",'", "~"],
        ["}", ")", "\\", "\\"],
        ["{", "(", "\\", "\\"]
      ],
      l = (e, t) => {
        let n = new RegExp((t[2] ? t[2] : "") + t[0] + "|" + (t[3] ? t[3] : "") + t[1], "g")
        return e.replace(n, e => (e === t[0] ? t[1] : t[0]))
      }
    if (t) for (let t = 0; t < n.length; ++t) e = l(e, n[t])
    else for (let t = n.length; t--; ) e = l(e, n[t])
    return e
  }

  const { slot, ship, deck, airunit } = temp1.default.model

  const times = n => [...Array(n)].map((_, i) => i)

  const getItem = id => {
    if (!slot._map[id]) return

    const { mstID, level, skillLevel } = slot._map[id]
    return {
      masterId: mstID,
      improvement: level || undefined,
      proficiency: [0, 10, 25, 40, 55, 70, 85, 100][skillLevel] || undefined
    }
  }
  const getShip = id => {
    if (!ship._map[id]) return

    const { _o } = ship._map[id]
    const equipments = times(_o.api_slotnum).map(i => getItem(_o.api_slot[i]))
    const ex = getItem(_o.api_slot_ex)
    ex && equipments.push(ex)

    return {
      masterId: _o.api_ship_id,
      level: _o.api_lv,
      equipments
    }
  }
  const getFleet = i => {
    const f = deck._map[i + 1]
    return {
      ships: f ? f._o.api_ship.map(getShip) : []
    }
  }

  const maxLbKey = Math.max(...Object.keys(airunit._dic))
  const kcsLb = airunit._dic[maxLbKey]

  const getAirCorps = i => {
    if (!kcsLb || !kcsLb[i]) return { equipments: [] }
    return {
      equipments: kcsLb[i].squadrons.map(plane => getItem(plane.mem_id))
    }
  }

  const url = new URL("https://kcjervis.github.io/jervis")
  const json = JSON.stringify({
    side: "Player",
    fleetType: ["Single", "CarrierTaskForce", "SurfaceTaskForce", "TransportEscort"][deck.combined.type],
    fleets: times(4).map(getFleet),
    landBase: times(3).map(getAirCorps)
  })

  const crushed = JSONCrush(json)
  url.searchParams.set("crushed", crushed)
  console.log(url.href)
}
