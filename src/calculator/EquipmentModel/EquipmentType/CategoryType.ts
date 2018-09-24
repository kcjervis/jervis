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
export default class CategoryType {
  public readonly isSmallCaliberMainGun: boolean
  public readonly isMediumCaliberMainGun: boolean
  public readonly isLargeCaliberMainGun: boolean
  public readonly isSecondaryGun: boolean
  public readonly isTorpedo: boolean
  public readonly isCarrierBasedFighterAircraft: boolean
  public readonly isCarrierBasedDiveBomber: boolean
  public readonly isCarrierBasedTorpedoBomber: boolean
  public readonly isCarrierBasedReconnaissanceAircraft: boolean
  public readonly isReconnaissanceSeaplane: boolean
  public readonly isSeaplaneBomber: boolean
  public readonly isSmallRadar: boolean
  public readonly isLargeRadar: boolean
  public readonly isSonar: boolean
  public readonly isDepthCharge: boolean
  public readonly isExtraArmor: boolean
  public readonly isEngineImprovement: boolean
  public readonly isAntiAircraftShell: boolean
  public readonly isArmorPiercingShell: boolean
  public readonly isVTFuze: boolean
  public readonly isAntiAircraftGun: boolean
  public readonly isMidgetSubmarine: boolean
  public readonly isEmergencyRepairPersonnel: boolean
  public readonly isLandingCraft: boolean
  public readonly isAutogyro: boolean
  public readonly isAntiSubmarinePatrolAircraft: boolean
  public readonly isMediumExtraArmor: boolean
  public readonly isLargeExtraArmor: boolean
  public readonly isSearchlight: boolean
  public readonly isSupplyTransportContainer: boolean
  public readonly isShipRepairFacility: boolean
  public readonly isSubmarineTorpedo: boolean
  public readonly isStarShell: boolean
  public readonly isCommandFacility: boolean
  public readonly isAviationPersonnel: boolean
  public readonly isAntiAircraftFireDirector: boolean
  public readonly isAntiGroundEquipment: boolean
  public readonly isLargeCaliberMainGun2: boolean
  public readonly isSurfaceShipPersonnel: boolean
  public readonly isLargeSonar: boolean
  public readonly isLargeFlyingBoat: boolean
  public readonly isLargeSearchlight: boolean
  public readonly isCombatRation: boolean
  public readonly isSupplies: boolean
  public readonly isSeaplaneFighter: boolean
  public readonly isSpecialAmphibiousTank: boolean
  public readonly isLandBasedAttackAircraft: boolean
  public readonly isLandBasedFighter: boolean
  public readonly isTransportationMaterial: boolean
  public readonly isSubmarineEquipment: boolean
  public readonly isJetPoweredFighter: boolean
  public readonly isJetPoweredFighterBomber: boolean
  public readonly isJetPoweredTorpedoBomber: boolean
  public readonly isJetPoweredReconnaissanceAircraft: boolean
  public readonly isLargeRadar2: boolean
  public readonly isCarrierBasedReconnaissanceAircraft2: boolean

  constructor(private readonly categoryId: number) {
    const categoryIs = (id: CategoryIds) => this.categoryId === id
    this.isSmallCaliberMainGun = categoryIs(CategoryIds.SmallCaliberMainGun)
    this.isMediumCaliberMainGun = categoryIs(CategoryIds.MediumCaliberMainGun)
    this.isLargeCaliberMainGun = categoryIs(CategoryIds.LargeCaliberMainGun)
    this.isSecondaryGun = categoryIs(CategoryIds.SecondaryGun)
    this.isTorpedo = categoryIs(CategoryIds.Torpedo)
    this.isCarrierBasedFighterAircraft = categoryIs(CategoryIds.CarrierBasedFighterAircraft)
    this.isCarrierBasedDiveBomber = categoryIs(CategoryIds.CarrierBasedDiveBomber)
    this.isCarrierBasedTorpedoBomber = categoryIs(CategoryIds.CarrierBasedTorpedoBomber)
    this.isCarrierBasedReconnaissanceAircraft = categoryIs(CategoryIds.CarrierBasedReconnaissanceAircraft)
    this.isReconnaissanceSeaplane = categoryIs(CategoryIds.ReconnaissanceSeaplane)
    this.isSeaplaneBomber = categoryIs(CategoryIds.SeaplaneBomber)
    this.isSmallRadar = categoryIs(CategoryIds.SmallRadar)
    this.isLargeRadar = categoryIs(CategoryIds.LargeRadar)
    this.isSonar = categoryIs(CategoryIds.Sonar)
    this.isDepthCharge = categoryIs(CategoryIds.DepthCharge)
    this.isExtraArmor = categoryIs(CategoryIds.ExtraArmor)
    this.isEngineImprovement = categoryIs(CategoryIds.EngineImprovement)
    this.isAntiAircraftShell = categoryIs(CategoryIds.AntiAircraftShell)
    this.isArmorPiercingShell = categoryIs(CategoryIds.ArmorPiercingShell)
    this.isVTFuze = categoryIs(CategoryIds.VTFuze)
    this.isAntiAircraftGun = categoryIs(CategoryIds.AntiAircraftGun)
    this.isMidgetSubmarine = categoryIs(CategoryIds.MidgetSubmarine)
    this.isEmergencyRepairPersonnel = categoryIs(CategoryIds.EmergencyRepairPersonnel)
    this.isLandingCraft = categoryIs(CategoryIds.LandingCraft)
    this.isAutogyro = categoryIs(CategoryIds.Autogyro)
    this.isAntiSubmarinePatrolAircraft = categoryIs(CategoryIds.AntiSubmarinePatrolAircraft)
    this.isMediumExtraArmor = categoryIs(CategoryIds.MediumExtraArmor)
    this.isLargeExtraArmor = categoryIs(CategoryIds.LargeExtraArmor)
    this.isSearchlight = categoryIs(CategoryIds.Searchlight)
    this.isSupplyTransportContainer = categoryIs(CategoryIds.SupplyTransportContainer)
    this.isShipRepairFacility = categoryIs(CategoryIds.ShipRepairFacility)
    this.isSubmarineTorpedo = categoryIs(CategoryIds.SubmarineTorpedo)
    this.isStarShell = categoryIs(CategoryIds.StarShell)
    this.isCommandFacility = categoryIs(CategoryIds.CommandFacility)
    this.isAviationPersonnel = categoryIs(CategoryIds.AviationPersonnel)
    this.isAntiAircraftFireDirector = categoryIs(CategoryIds.AntiAircraftFireDirector)
    this.isAntiGroundEquipment = categoryIs(CategoryIds.AntiGroundEquipment)
    this.isLargeCaliberMainGun2 = categoryIs(CategoryIds.LargeCaliberMainGun2)
    this.isSurfaceShipPersonnel = categoryIs(CategoryIds.SurfaceShipPersonnel)
    this.isLargeSonar = categoryIs(CategoryIds.LargeSonar)
    this.isLargeFlyingBoat = categoryIs(CategoryIds.LargeFlyingBoat)
    this.isLargeSearchlight = categoryIs(CategoryIds.LargeSearchlight)
    this.isCombatRation = categoryIs(CategoryIds.CombatRation)
    this.isSupplies = categoryIs(CategoryIds.Supplies)
    this.isSeaplaneFighter = categoryIs(CategoryIds.SeaplaneFighter)
    this.isSpecialAmphibiousTank = categoryIs(CategoryIds.SpecialAmphibiousTank)
    this.isLandBasedAttackAircraft = categoryIs(CategoryIds.LandBasedAttackAircraft)
    this.isLandBasedFighter = categoryIs(CategoryIds.LandBasedFighter)
    this.isTransportationMaterial = categoryIs(CategoryIds.TransportationMaterial)
    this.isSubmarineEquipment = categoryIs(CategoryIds.SubmarineEquipment)
    this.isJetPoweredFighter = categoryIs(CategoryIds.JetPoweredFighter)
    this.isJetPoweredFighterBomber = categoryIs(CategoryIds.JetPoweredFighterBomber)
    this.isJetPoweredTorpedoBomber = categoryIs(CategoryIds.JetPoweredTorpedoBomber)
    this.isJetPoweredReconnaissanceAircraft = categoryIs(CategoryIds.JetPoweredReconnaissanceAircraft)
    this.isLargeRadar2 = categoryIs(CategoryIds.LargeRadar2)
    this.isCarrierBasedReconnaissanceAircraft2 = categoryIs(CategoryIds.CarrierBasedReconnaissanceAircraft2)
  }
}
