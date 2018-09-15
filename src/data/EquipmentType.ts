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
  constructor(public readonly typeIds: Readonly<number[]>) {
    this.categoryId = typeIds[2]
    this.iconId = typeIds[3]
  }
  public is(categoryName: keyof typeof CategoryIds) {
    return CategoryIds[categoryName] === this.categoryId
  }
}
