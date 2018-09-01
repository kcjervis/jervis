import BaseShip from './Ship'
import BaseEquipmentModel from './Equipment'
import AerialCombatPlaneMixin from './AerialCombatPlaneMixin'

export const EquipmentModel = AerialCombatPlaneMixin(BaseEquipmentModel)
export const ShipModel = BaseShip
