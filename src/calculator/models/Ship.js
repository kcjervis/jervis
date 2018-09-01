import MasterData from '../../data'
import ImageManager from '../../images'

export default class Ship {
  constructor(shipObj) {
    const { id, masterId, equipments, expansionEquipment } = shipObj

    const masterShip = MasterData.getShip(masterId)
    for (let [key, value] of Object.entries(masterShip)) {
      this[key] = value
    }

    this.id = id
    this.masterId = masterId
    this.equipments = equipments
    this.expansionEquipment = expansionEquipment

    this.isAbysall = this.masterId > 1500
    ;['firepower', 'torpedo', 'torpedo', 'antiAir'].forEach(key => {
      this[key] =
        masterShip[`max${key.replace(/^\D/g, char => char.toUpperCase())}`]
    })
    this.firepower = masterShip.maxFirepower
    this.torpedo = masterShip.maxTorpedo
    this.armor = this.image = {}
    this.image.banner = ImageManager.getShipBanner(masterId)
  }

  get canRemodel() {
    return Boolean(this.remodel && this.remodel.next)
  }

  get canConvert() {
    if (!this.canRemodel) { return false }
    const { prev, next } = this.remodel
    if (prev === next) { return true }
    return MasterData.getShip(next).remodel.next === this.masterId
  }
}
