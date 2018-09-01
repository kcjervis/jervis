const AerialCombatShipMixin = ShipModel =>
  class extends ShipModel {
    constructor(shipObj) {
      super(shipObj)
    }
    calcFighterPower(phase) {
      let fighterPower = 0
      const { equipments, slots } = this
      for (const equipment of equipments) {
        if (phase === 'CarrierBasedAerialCombat') {
          if (!this.isCarrierBasedAerialCombatPlane) continue
        } else {
          if (!this.isLandBasedAerialCombatPlane) continue
        }

        const slotSize = slots[equipment.index]
        fighterPower += equipment.calcFighterPower(slotSize, phase)
      }
      return fighterPower
    }

    get adjustedAntiAir() {
      const sumEquipmentAdjustedAntiAir = this.allEquipments.reduce(
        (cur, equipment) => cur + equipment.adjustedAntiAir
      )
      if (this.isEnemy) {
        return Math.sqrt(this.antiAir) + sumEquipmentAdjustedAntiAir
      } else {
        return this.baseAntiAir / 2 + sumEquipmentAdjustedAntiAir
      }
    }

    get antiAirDefense() {
      const sumEquipmentAntiAirDefense = this.allEquipments.reduce(
        (cur, equipment) => cur + equipment.antiAirDefense
      )
      return Math.floor(sumEquipmentAntiAirDefense)
    }

    calcCombinedFleetAntiAirModifier(battleType) {
      if (this.isCombined) {
        if (battleType === 'AirDefense') {
          return this.isMainFleet ? 0.8 : 0.48
        } else {
          return this.isMainFleet ? 0.72 : 0.48
        }
      }
      return 1
    }

    calcProportionalShotdownRate(battleType) {
      const combinedModifier = this.calcCombinedFleetAntiAirModifier(battleType)
      return (this.adjustedAntiAir * combinedModifier) / 400
    }

    calcFixedShotdown(battleType, fleetAntiAirDefense, antiAirCutInBonus) {
      const combinedModifier = this.calcCombinedFleetAntiAirModifier(battleType)
      return Math.floor(
        ((this.adjustedAntiAir + fleetAntiAirDefense) *
          combinedModifier *
          antiAirCutInBonus) /
          10
      )
    }

    shotDownBystage2(phase, formation) {
      if (phase === 'JetAssault') {
      }
    }
  }
