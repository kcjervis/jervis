import EquipmentModel, { Aircraft } from './EquipmentModel'
import OprationModel from './OperationModel'

/** AirSupremacy */
export type AirControlState = 'AirSupremacy' | 'AirSuperiority' | 'AirParity' | 'AirDenial' | 'AirIncapability'
export type AaerialCombatType = 'JetAssault' | 'LandBaseAerialSupport' | 'CarrierBasedAerialCombat' | 'AirRaid'

export default class AerialCombat {
  public isCombinedFleetCombat: boolean
  public aerialCombatType: AaerialCombatType = 'CarrierBasedAerialCombat'
  public airControlState: AirControlState = 'AirIncapability'
  constructor(public operation: OprationModel, public enemyOperation: OprationModel) {
    this.isCombinedFleetCombat = false
  }

  public getAirControlStateConstant() {
    switch (this.airControlState) {
      case 'AirSupremacy':
        return 1
      case 'AirSuperiority':
        return 3
      case 'AirParity':
        return 5
      case 'AirDenial':
        return 7
      case 'AirIncapability':
        return 10
    }
  }

  public fighterCombat() {
    const aircrafts = this.operation.fleets[0].getAircrafts().filter(this.aircraftFilter)
    const enemyAircrafts = this.enemyOperation.fleets[0].getAircrafts().filter(this.aircraftFilter)

    const fighterPower = aircrafts.reduce((value, aircraft) => value + aircraft.calculateFighterPower(), 0)
    const enemyFighterPower = enemyAircrafts.reduce((value, aircraft) => value + aircraft.calculateFighterPower(), 0)

    if (fighterPower >= 3 * enemyFighterPower) {
      this.airControlState = 'AirSupremacy'
    } else if (fighterPower >= 1.5 * fighterPower) {
      this.airControlState = 'AirSuperiority'
    } else if (fighterPower >= (2 / 3) * fighterPower) {
      this.airControlState = 'AirParity'
    } else if (fighterPower >= (1 / 3) * fighterPower) {
      this.airControlState = 'AirIncapability'
    } else {
      this.airControlState = 'AirIncapability'
    }

    const airControlStateConstant = this.getAirControlStateConstant()

    aircrafts.forEach(aircraft => {
      const minNum = airControlStateConstant / 4
      const maxRandomValue = Math.floor(Math.sqrt((airControlStateConstant / 3) * 100))
      const randomValue = Math.floor(Math.random() * (maxRandomValue + 1)) / 100 + minNum
      const proportional = randomValue / 10
      const shotDownNum = Math.floor(aircraft.slot * proportional)
      aircraft.shotDown(shotDownNum)
    })

    enemyAircrafts.forEach(aircraft => {
      const maxRandomValue = 11 - airControlStateConstant
      const randomValue =
        0.35 * Math.floor(Math.random() * (maxRandomValue + 1)) +
        0.65 * Math.floor(Math.random() * (maxRandomValue + 1))
      const proportional = randomValue / 10
      const shotDownNum = Math.floor(aircraft.slot * proportional)
      aircraft.shotDown(shotDownNum)
    })
  }

  public stage1() {
    this.fighterCombat()
  }

  public antiAirCutIn() {
    if (this.aerialCombatType !== 'CarrierBasedAerialCombat') {
      return
    }
    console.log('antiAirCutIn')
  }
  public stage2() {
    console.log('stage2')
  }
  private aircraftFilter(aircraft: Aircraft) {
    const {
      isJetPoweredAircraft,
      isFighter,
      isDiveBomber,
      isTorpedoBomber,
      isReconnaissanceAircraft
    } = aircraft.aircraftType

    if (this.aerialCombatType === 'JetAssault' && !isJetPoweredAircraft) {
      return false
    }
    if (isFighter || isDiveBomber || isTorpedoBomber) {
      return true
    }
    if (this.aerialCombatType === 'LandBaseAerialSupport' && isReconnaissanceAircraft) {
      return true
    }
    return false
  }
}
