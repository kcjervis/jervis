import { MasterData, ObjectFactory } from "kc-calculator"
import { GearName } from "@jervis/data"

export const masterData = new MasterData()

masterData.ships.sort((ship0, ship1) => ship0.sortId - ship1.sortId)

const kcObjectFactory = new ObjectFactory(masterData)

export const makeGear = (name: GearName) => {
  const gearId = masterData.gearNameToId(name) ?? 0
  const gear = kcObjectFactory.createGear({ masterId: gearId })
  if (!gear) {
    throw "gear is undefined"
  }
  return gear
}

export default kcObjectFactory
