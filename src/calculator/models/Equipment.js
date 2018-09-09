import MasterData from '../../data'
import ImageManager from '../../images'

export default class Equipment {
  constructor(equipmentObj) {
    const {
      id,
      index,
      masterId,
      improvement,
      internalProficiency
    } = equipmentObj
    const masterEquipment = MasterData.getEquipment(masterId)
    for (let [key, value] of Object.entries(masterEquipment)) {
      this[key] = value
    }

    this.id = id
    this.index = index
    this.masterId = masterId
    this.categoryId = this.types[2]
    this.iconId = this.types[3]

    this.improvement = improvement
    this.internalProficiency = internalProficiency

    this.isAbysall = this.masterId > 500
    //isCategory
    for (const category of MasterData.equipmentCategories) {
      this[`is${category.key}`] = category.id === this.categoryId
    }

    this.image = {}
    this.image.icon = ImageManager.import(`equipments/icons/${this.iconId}.png`)
    if (!this.isAbysall) {
      this.image.itemOn = ImageManager.import(
        `equipments/itemOn/${this.masterId}.png`
      )
    }
  }
}
