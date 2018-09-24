enum CategoryIds {
  SmallCaliberMainGun = 1,
  MediumCaliberMainGun,
  LargeCaliberMainGun,
  SecondaryGun,
  Torpedo,
  CarrierBasedFighterAircraft,
  CarrierBasedDiveBomber,
  CarrierBasedTorpedoBomber,
  CarrierBasedReconnaissanceAircraft,
  ReconnaissanceSeaplane,
  SeaplaneBomber,
  SmallRadar,
  LargeRadar,
  Sonar,
  DepthCharge,
  ExtraArmor,
  EngineImprovement,
  AntiAircraftShell,
  ArmorPiercingShell,
  VTFuze,
  AntiAircraftGun,
  MidgetSubmarine,
  EmergencyRepairPersonnel,
  LandingCraft,
  Autogyro,
  AntiSubmarinePatrolAircraft,
  MediumExtraArmor,
  LargeExtraArmor,
  Searchlight,
  SupplyTransportContainer,
  ShipRepairFacility,
  SubmarineTorpedo,
  StarShell,
  CommandFacility,
  AviationPersonnel,
  AntiAircraftFireDirector,
  AntiGroundEquipment,
  LargeCaliberMainGun2,
  SurfaceShipPersonnel,
  LargeSonar,
  LargeFlyingBoat,
  LargeSearchlight,
  CombatRation,
  Supplies,
  SeaplaneFighter,
  SpecialAmphibiousTank,
  LandBasedAttackAircraft,
  LandBasedFighter,
  TransportationMaterial = 50,
  SubmarineEquipment,
  JetPoweredFighter = 56,
  JetPoweredFighterBomber,
  JetPoweredTorpedoBomber,
  JetPoweredReconnaissanceAircraft,
  LargeRadar2 = 93,
  CarrierBasedReconnaissanceAircraft2
}

export default class EquipmentType {
  public readonly categoryId: number
  public readonly iconId: number

  public readonly isCarrierBasedAircraft: boolean
  public readonly isSeaplane: boolean
  public readonly isLandBasedAircraft: boolean
  public readonly isJetPoweredAircraft: boolean
  public readonly isAircraft: boolean
  public readonly isFighter: boolean
  constructor(public readonly typeIds: Readonly<number[]>) {
    this.categoryId = typeIds[2]
    this.iconId = typeIds[3]

    this.isCarrierBasedAircraft = [
      CategoryIds.CarrierBasedFighterAircraft,
      CategoryIds.CarrierBasedDiveBomber,
      CategoryIds.CarrierBasedTorpedoBomber,
      CategoryIds.CarrierBasedReconnaissanceAircraft,
      CategoryIds.CarrierBasedReconnaissanceAircraft2
    ].includes(this.categoryId)

    this.isSeaplane = [
      CategoryIds.ReconnaissanceSeaplane,
      CategoryIds.SeaplaneBomber,
      CategoryIds.LargeFlyingBoat,
      CategoryIds.SeaplaneFighter
    ].includes(this.categoryId)

    this.isLandBasedAircraft = [CategoryIds.LandBasedAttackAircraft, CategoryIds.LandBasedFighter].includes(
      this.categoryId
    )

    this.isJetPoweredAircraft = [
      CategoryIds.JetPoweredFighter,
      CategoryIds.JetPoweredFighterBomber,
      CategoryIds.JetPoweredTorpedoBomber,
      CategoryIds.JetPoweredReconnaissanceAircraft
    ].includes(this.categoryId)

    this.isAircraft =
      this.isCarrierBasedAircraft ||
      this.isSeaplane ||
      this.isLandBasedAircraft ||
      this.isJetPoweredAircraft ||
      this.is('Autogyro') ||
      this.is('AntiSubmarinePatrolAircraft')

    this.isFighter = [
      CategoryIds.CarrierBasedFighterAircraft,
      CategoryIds.SeaplaneFighter,
      CategoryIds.LandBasedFighter
    ].includes(this.categoryId)
  }

  public is(categoryName: keyof typeof CategoryIds) {
    return CategoryIds[categoryName] === this.categoryId
  }
}
