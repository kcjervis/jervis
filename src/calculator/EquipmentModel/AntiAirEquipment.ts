import EquipmentModel from './EquipmentModel'
import { CategoryType } from './EquipmentType'
export default class AntiAirEquipment extends EquipmentModel {
  public categoryType: CategoryType
  public isHighAngleGun: boolean
  public isRadar: boolean

  public adjustedAntiAir: number
  public fleetAntiAir: number

  constructor(public readonly equipment: EquipmentModel, private readonly slots: number[]) {
    super(equipment)
    this.categoryType = this.type.categoryType

    const { categoryType } = this
    this.isHighAngleGun = this.type.iconId === 16
    this.isRadar = categoryType.isSmallRadar || categoryType.isLargeRadar || categoryType.isLargeRadar2

    this.adjustedAntiAir = this.calculateAdjustedAntiAir()
    this.fleetAntiAir = this.calculateFleetAntiAir()
  }

  private calculateAdjustedAntiAir() {
    const { antiAir, improvement, categoryType } = this
    if (!antiAir) {
      return 0
    }

    let equipmentTypeMod = 0
    let improvementMod = 0
    if (categoryType.isAntiAircraftGun) {
      equipmentTypeMod = 3
      improvementMod = antiAir <= 7 ? 2 : 3
    } else if (categoryType.isAntiAircraftFireDirector || this.isHighAngleGun) {
      equipmentTypeMod = 2
      improvementMod = antiAir <= 7 ? 1 : 1.5
    } else if (this.isRadar) {
      equipmentTypeMod = 1.5
    }
    return 2 * (equipmentTypeMod * antiAir + improvementMod * Math.sqrt(improvement))
  }

  private calculateFleetAntiAir() {
    const { antiAir, categoryType } = this
    if (!antiAir) {
      return 0
    }
    let equipmentTypeMod = 0
    let improvementMod = 0
    if (categoryType.isAntiAircraftFireDirector || this.isHighAngleGun) {
      equipmentTypeMod = 0.35
      improvementMod = antiAir <= 7 ? 2 : 3
    } else if (categoryType.isAntiAircraftShell) {
      equipmentTypeMod = 0.6
    } else if (this.isRadar) {
      equipmentTypeMod = 0.4
      if (antiAir > 1) {
        improvementMod = 1.5
      }
    } else if (this.name === '46cm三連装砲') {
      equipmentTypeMod = 0.25
    } else {
      equipmentTypeMod = 0.2
    }
    return equipmentTypeMod * antiAir + improvementMod * Math.sqrt(this.improvement)
  }
}
