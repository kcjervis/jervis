import { IShip, AerialCombat } from "kc-calculator"
import { sumBy, uniq } from "lodash-es"

const { AntiAirCutin } = AerialCombat
type AntiAirCutin = AerialCombat.AntiAirCutin

export type AntiAirCutinRateDatum = { cutin: AntiAirCutin; rate: number }

const isSpecialAaci = (aaci: AntiAirCutin) => [34, 35].includes(aaci.id)

const getShipRateData = (ship: IShip) => {
  const antiAirCutins = AntiAirCutin.getPossibleAntiAirCutins(ship)
  const cutinRateData = new Array<AntiAirCutinRateDatum>()

  const specialAntiAirCutins = antiAirCutins.filter(isSpecialAaci)
  const normalAntiAirCutins = antiAirCutins.filter(aaci => !isSpecialAaci(aaci))

  const totalSpecialAaciRate = specialAntiAirCutins.reduce((prevRate, aaci) => {
    const rate = (1 - prevRate) * (aaci.probability / 101)
    cutinRateData.push({ cutin: aaci, rate })
    return prevRate + rate
  }, 0)

  const totalNormalAaciRate = normalAntiAirCutins.reduce((prevRate, aaci) => {
    const rate = aaci.probability / 101
    let curRate = rate - prevRate
    if (curRate < 0) {
      cutinRateData.push({ cutin: aaci, rate: 0 })
      return prevRate
    }
    if (totalSpecialAaciRate > 0) {
      curRate = (1 - totalSpecialAaciRate) * curRate
    }
    cutinRateData.push({ cutin: aaci, rate: curRate })
    return rate
  }, 0)

  return cutinRateData
}

type RateDataMap = Map<IShip, AntiAirCutinRateDatum[]>

const calcFleetCutinRate = (dataMap: RateDataMap, aaci: AntiAirCutin) => {
  let gtRate = 0
  let ltRate = 1
  dataMap.forEach(data => {
    gtRate += (1 - gtRate) * sumBy(data.filter(datum => datum.cutin.id > aaci.id), datum => datum.rate)
    ltRate *= 1 - sumBy(data.filter(datum => datum.cutin.id >= aaci.id), datum => datum.rate)
  })

  return 1 - (gtRate + ltRate)
}

const getShipsRateData = (ships: IShip[]) => {
  const shipRateDataMap: RateDataMap = new Map()
  for (const ship of ships) {
    const data = getShipRateData(ship).filter(datum => datum.rate > 0)
    shipRateDataMap.set(ship, data)
  }

  const fleetCutins = uniq(
    Array.from(shipRateDataMap.values())
      .flat()
      .map(datum => datum.cutin)
  ).sort((aaci1, aaci2) => aaci2.id - aaci1.id)

  return fleetCutins.map(cutin => ({ cutin, rate: calcFleetCutinRate(shipRateDataMap, cutin) }))
}

const calcAntiAirCutinRates = (arg: IShip | IShip[]) => {
  if (Array.isArray(arg)) {
    return getShipsRateData(arg)
  }
  return getShipRateData(arg)
}

export default calcAntiAirCutinRates
