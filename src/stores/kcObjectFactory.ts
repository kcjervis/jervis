import { MasterData, ObjectFactory } from 'kc-calculator'

export const masterData = new MasterData()
masterData.ships.sort((ship0, ship1) => ship0.sortId - ship1.sortId)
const kcObjectFactory = new ObjectFactory(masterData)
export default kcObjectFactory
