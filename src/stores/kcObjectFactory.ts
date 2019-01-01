import { MasterData, ObjectFactory } from 'kc-calculator'

export const masterData = new MasterData()
const kcObjectFactory = new ObjectFactory(masterData)

export default kcObjectFactory
