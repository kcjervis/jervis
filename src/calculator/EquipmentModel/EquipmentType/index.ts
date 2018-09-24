import AircraftType from './AircraftType'
import CategoryType from './CategoryType'

export default class EquipmentType {
  public readonly categoryId: number
  public readonly iconId: number

  public readonly categoryType: CategoryType
  public readonly aircraftType: AircraftType

  constructor(public readonly typeIds: Readonly<number[]>) {
    this.categoryId = typeIds[2]
    this.iconId = typeIds[3]

    this.categoryType = new CategoryType(this.categoryId)
    this.aircraftType = new AircraftType(this.categoryType)
  }
}

export { AircraftType, CategoryType }
