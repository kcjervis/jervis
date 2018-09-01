import MasterData from '../data'

export default class ImageManager {
  static import(path) {
    try {
      return require(`./${path}`)
    } catch (e) {
      console.log(`No Image ${path}`)
    }
  }

  static getShipBanner(masterId, searchSameShip) {
    try {
      return require(`./ships/banner/${masterId}.png`)
    } catch (e) {
      if (!searchSameShip) {
        const { name } = MasterData.getShip(masterId)
        const sameShips = MasterData.ships.filter(ship => ship.name === name)
        for (const ship of sameShips) {
          const banner = this.getShipBanner(ship.id, true)
          if (banner) { return banner }
        }
      } else {
        console.log(`No Ship Banner ${masterId}`)
      }
    }
  }
}
