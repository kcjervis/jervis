import { IShip, AerialCombat } from 'kc-calculator'

type CutinRate = { ci: AerialCombat.AntiAirCutin; rate: number }

const isSpecialAaci = (aaci: AerialCombat.AntiAirCutin) => [34, 35].includes(aaci.id)

const calcShipAntiAirCutinRates = (ship: IShip) => {
  const antiAirCutins = AerialCombat.AntiAirCutin.getPossibleAntiAirCutins(ship)
  const cutinRates = new Array<CutinRate>()

  const specialAntiAirCutins = antiAirCutins.filter(isSpecialAaci)
  const totalSpecialAaciRate = specialAntiAirCutins.reduce((prevRate, aaci) => {
    const rate = ((1 - prevRate) * aaci.probability) / 101
    cutinRates.push({ ci: aaci, rate })
    return rate
  }, 0)

  const normalAntiAirCutins = antiAirCutins.filter(aaci => !isSpecialAaci(aaci))
  const totalNormalAaciRate = normalAntiAirCutins.reduce((prevRate, aaci) => {
    const rate = aaci.probability / 101
    let curRate = rate - prevRate
    if (curRate < 0) {
      cutinRates.push({ ci: aaci, rate: 0 })
      return prevRate
    }
    if (totalSpecialAaciRate > 0) {
      curRate = (1 - totalSpecialAaciRate) * curRate
    }
    cutinRates.push({ ci: aaci, rate: curRate })
    return rate
  }, 0)

  return cutinRates
}

const calcShipsAntiAirCutinRates = (ships: IShip[]) => {
  const fleetCutinRates = new Array<CutinRate>()
  const shipCutinRates = ships
    .flatMap(calcShipAntiAirCutinRates)
    .filter(aaciRate => aaciRate.rate > 0)
    .sort((aaciRate1, aaciRate2) => aaciRate2.ci.id - aaciRate1.ci.id)
  for (const { ci, rate } of shipCutinRates) {
    const foundCutinRate = fleetCutinRates.find(cutinRate => cutinRate.ci === ci)
    if (!foundCutinRate) {
      fleetCutinRates.push({ ci, rate })
      continue
    }
    const curRate = (1 - foundCutinRate.rate) * rate
    foundCutinRate.rate += curRate
  }

  const totalFleetCutinRate = fleetCutinRates.reduce((totalRate, curAaciRate) => {
    let curRate = (1 - totalRate) * curAaciRate.rate
    if (curRate < 0) {
      curRate = 0
    }
    curAaciRate.rate = curRate
    return totalRate + curRate
  }, 0)

  return fleetCutinRates
}

const calcAntiAirCutinRates = (arg: IShip | IShip[]) => {
  if (Array.isArray(arg)) {
    return calcShipsAntiAirCutinRates(arg)
  }
  return calcShipAntiAirCutinRates(arg)
}

export default calcAntiAirCutinRates
