const AerialCombatPlaneMixin = EquipmentModel =>
  class extends EquipmentModel {
    constructor(equipment) {
      super(equipment)

      this.isAttacker =
        this.isCarrierBasedTorpedoBomber ||
        this.LandBasedAttackAircraft ||
        this.JetPoweredTorpedoBomber

      this.isBomber =
        this.isCarrierBasedDiveBomber ||
        this.isSeaplaneBomber ||
        this.isJetPoweredFighterBomber

      this.isFighter =
        this.isCarrierBasedFighterAircraft ||
        this.isSeaplaneFighter ||
        this.isLandBasedFighter ||
        this.isJetPoweredFighter

      this.isReconnaissance =
        this.isCarrierBasedReconnaissanceAircraft ||
        this.isReconnaissanceSeaplane ||
        this.isLargeFlyingBoat ||
        this.isJetPoweredReconnaissanceAircraft ||
        this['isCarrierBasedReconnaissanceAircraft(II)']

      this.isCarrierBasedAerialCombatPlane =
        this.isAttacker || this.isBomber || this.isFighter

      this.isAerialCombatPlane =
        this.isCarrierBasedAerialCombatPlane || this.isReconnaissance

      this.isLandBasedAerialCombatPlane = this.isAerialCombatPlane

      this.isHighAngleGun = this.iconId === 16

      this.isRadar =
        this.isSmallRadar || this.isLargeRadar || this['isLargeRadar(II)']
    }

    get proficiencyFighterPowerBonus() {
      const { internalProficiency } = this
      if (!this.isAerialCombatPlane || !internalProficiency) { return 0 }

      let bonuses = [{ bound: 0, value: 0 }]

      if (this.isFighter) {
        bonuses = [
          { bound: 100, value: 22 },
          { bound: 70, value: 14 },
          { bound: 55, value: 9 },
          { bound: 40, value: 5 },
          { bound: 25, value: 2 },
          { bound: 0, value: 0 }
        ]
      } else if (this.isSeaplaneBomber) {
        bonuses = [
          { bound: 100, value: 6 },
          { bound: 70, value: 3 },
          { bound: 25, value: 1 },
          { bound: 0, value: 0 }
        ]
      }

      const fpBonus = bonuses.find(({ bound }) => bound <= internalProficiency)
        .value
      return fpBonus + Math.sqrt(internalProficiency / 10)
    }

    get fighterPowerImprovementBonus() {
      const { improvement = 0 } = this
      if (this.isFighter) { return 0.2 * improvement }
      else if (this.isCarrierBasedDiveBomber) { return 0.25 * improvement }
      return 0
    }

    calcFighterPower(phase, slotSize) {
      if (!slotSize) { return 0 }
      const { antiAir = 0, interception = 0, antiBomber = 0 } = this
      let fighterPowerCoefficient = antiAir + this.fighterPowerImprovementBonus
      if (phase === 'LandBaseAerialSupport') {
        fighterPowerCoefficient += 1.5 * interception
      } else if (phase === 'AirRaid') {
        fighterPowerCoefficient += interception + 2 * antiBomber
      }

      return Math.floor(
        fighterPowerCoefficient * Math.sqrt(slotSize) +
          this.proficiencyFighterPowerBonus
      )
    }

    get adjustedAntiAir() {
      const { antiAir, improvement = 0 } = this
      if (!antiAir) { return 0 }
      let equipmentTypeMod = 0
      let improvementMod = 0
      if (this.isAntiAircraftGun) {
        equipmentTypeMod = 3
        improvementMod = antiAir <= 7 ? 2 : 3
      } else if (this.isAntiAircraftFireDirector || this.isHighAngleGun) {
        equipmentTypeMod = 2
        improvementMod = antiAir <= 7 ? 1 : 1.5
      } else if (this.isRadar) {
        equipmentTypeMod = 1.5
      }
      return (
        2 *
        (equipmentTypeMod * antiAir + improvementMod * Math.sqrt(improvement))
      )
    }

    get antiAirDefense() {
      if (!this.antiAir) { return 0 }
      let equipmentTypeMod = 0
      let improvementMod = 0
      if (this.isAntiAircraftFireDirector || this.isHighAngleGun) {
        equipmentTypeMod = 0.35
        improvementMod = this.antiAir <= 7 ? 2 : 3
      } else if (this.isAntiAircraftShell) {
        equipmentTypeMod = 0.6
      } else if (this.isRadar) {
        equipmentTypeMod = 0.4
        if (this.antiAir > 1) { improvementMod = 1.5 }
      } else if (this.name === '46cm三連装砲') {
        equipmentTypeMod = 0.25
      } else {
        equipmentTypeMod = 0.2
      }
      return (
        equipmentTypeMod * this.antiAir +
        improvementMod * Math.sqrt(this.improvement)
      )
    }
  }

export default AerialCombatPlaneMixin
