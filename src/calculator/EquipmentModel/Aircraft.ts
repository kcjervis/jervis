import EquipmentModel from './EquipmentModel'
import { AircraftType, CategoryType } from './EquipmentType'
export default class Aircraft extends EquipmentModel {
  get slot() {
    const { slots, index } = this
    return slots[index]
  }
  set slot(value: number) {
    const { slots, index } = this
    slots[index] = value
  }
  public static readonly rankedFighterPowerBonus = {
    fighter: [
      { bound: 100, value: 22 },
      { bound: 70, value: 14 },
      { bound: 55, value: 9 },
      { bound: 40, value: 5 },
      { bound: 25, value: 2 },
      { bound: 0, value: 0 }
    ],
    seaplaneBomber: [{ bound: 100, value: 6 }, { bound: 70, value: 3 }, { bound: 25, value: 1 }, { bound: 0, value: 0 }]
  }
  public categoryType: CategoryType
  public aircraftType: AircraftType

  public proficiencyFighterPowerBonus: number
  public improvementFighterPowerBonus: number
  constructor(public readonly equipment: EquipmentModel, private readonly slots: number[]) {
    super(equipment)
    this.aircraftType = this.type.aircraftType
    this.categoryType = this.type.categoryType

    this.proficiencyFighterPowerBonus = this.calculateProficiencyFighterPowerBonus()
    this.improvementFighterPowerBonus = this.calculateImprovementFighterPowerBonus()
  }

  public calculateFighterPower() {
    const { slot, antiAir, interception, proficiencyFighterPowerBonus, improvementFighterPowerBonus } = this
    if (!slot) {
      return 0
    }
    return Math.floor(
      (antiAir + 1.5 * interception + improvementFighterPowerBonus) * Math.sqrt(slot) + proficiencyFighterPowerBonus
    )
  }

  public calculateAirDefensePower() {
    const { slot, antiAir, interception, proficiencyFighterPowerBonus, improvementFighterPowerBonus } = this
    if (!slot) {
      return 0
    }
    return Math.floor(
      (antiAir + 1.5 * interception + improvementFighterPowerBonus) * Math.sqrt(slot) + proficiencyFighterPowerBonus
    )
  }

  public shotDown(value: number) {
    this.slot -= value
    if (this.slot < 0) {
      this.slot = 0
    }
  }

  private calculateProficiencyFighterPowerBonus() {
    const { internalProficiency, categoryType, aircraftType } = this
    if (internalProficiency <= 0) {
      return 0
    }

    const internalProficiencyFighterPowerBonus = Math.sqrt(internalProficiency / 10)

    const { rankedFighterPowerBonus } = Aircraft

    if (aircraftType.isFighter) {
      for (const { bound, value } of rankedFighterPowerBonus.fighter) {
        if (bound <= internalProficiency) {
          return value + internalProficiencyFighterPowerBonus
        }
      }
    } else if (categoryType.isSeaplaneBomber) {
      for (const { bound, value } of rankedFighterPowerBonus.seaplaneBomber) {
        if (bound <= internalProficiency) {
          return value + internalProficiencyFighterPowerBonus
        }
      }
    }

    return internalProficiencyFighterPowerBonus
  }

  private calculateImprovementFighterPowerBonus() {
    const { improvement, categoryType, aircraftType } = this
    if (aircraftType.isFighter) {
      return 0.2 * improvement
    } else if (categoryType.isCarrierBasedDiveBomber) {
      return 0.25 * improvement
    }
    return 0
  }
}
