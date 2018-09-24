import CategoryType from './CategoryType'

export default class AircraftType {
  /** 艦載機 */
  public readonly isCarrierBasedAircraft: boolean
  /** 水上機 */
  public readonly isSeaplane: boolean
  /** 陸上機 */
  public readonly isLandBasedAircraft: boolean
  /** 噴式機 */
  public readonly isJetPoweredAircraft: boolean
  /** 航空戦に参加する航空機 */
  public readonly isAerialCombatAircraft: boolean
  public readonly isAircraft: boolean
  /** 戦闘機 */
  public readonly isFighter: boolean
  /** 爆撃機 */
  public readonly isDiveBomber: boolean
  /** 攻撃機 */
  public readonly isTorpedoBomber: boolean
  /** 偵察機 */
  public readonly isReconnaissanceAircraft: boolean

  constructor(private categoryType: CategoryType) {
    const {
      // 艦載機
      isCarrierBasedFighterAircraft,
      isCarrierBasedDiveBomber,
      isCarrierBasedTorpedoBomber,
      isCarrierBasedReconnaissanceAircraft,
      isCarrierBasedReconnaissanceAircraft2,

      // 水上機
      isReconnaissanceSeaplane,
      isSeaplaneBomber,
      isLargeFlyingBoat,
      isSeaplaneFighter,

      // 陸上機
      isLandBasedAttackAircraft,
      isLandBasedFighter,

      // 噴式機
      isJetPoweredFighter,
      isJetPoweredFighterBomber,
      isJetPoweredTorpedoBomber,
      isJetPoweredReconnaissanceAircraft,

      // オートジャイロ
      isAutogyro,

      // 対潜哨戒機
      isAntiSubmarinePatrolAircraft
    } = categoryType

    this.isCarrierBasedAircraft =
      isCarrierBasedFighterAircraft ||
      isCarrierBasedDiveBomber ||
      isCarrierBasedTorpedoBomber ||
      isCarrierBasedReconnaissanceAircraft ||
      isCarrierBasedReconnaissanceAircraft2

    this.isSeaplane = isReconnaissanceSeaplane || isSeaplaneBomber || isLargeFlyingBoat || isSeaplaneFighter

    this.isLandBasedAircraft = isLandBasedAttackAircraft || isLandBasedFighter

    this.isJetPoweredAircraft =
      isJetPoweredFighter ||
      isJetPoweredFighterBomber ||
      isJetPoweredTorpedoBomber ||
      isJetPoweredReconnaissanceAircraft

    this.isAerialCombatAircraft =
      this.isCarrierBasedAircraft || this.isSeaplane || this.isLandBasedAircraft || this.isJetPoweredAircraft

    this.isAircraft = this.isAerialCombatAircraft || isAutogyro || isAntiSubmarinePatrolAircraft

    this.isFighter = isCarrierBasedFighterAircraft || isSeaplaneFighter || isLandBasedFighter || isJetPoweredFighter

    this.isDiveBomber = isCarrierBasedDiveBomber || isSeaplaneBomber || isJetPoweredFighterBomber

    this.isTorpedoBomber = isCarrierBasedTorpedoBomber || isLandBasedAttackAircraft || isJetPoweredTorpedoBomber

    this.isReconnaissanceAircraft =
      isCarrierBasedReconnaissanceAircraft ||
      isCarrierBasedReconnaissanceAircraft2 ||
      isReconnaissanceSeaplane ||
      isLargeFlyingBoat ||
      isJetPoweredReconnaissanceAircraft
  }
}
