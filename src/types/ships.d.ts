declare module '*/ships' {
  export type TEquipment = Readonly<{ id: number, improvement?: number } | null>
  export type TShipData = Readonly<{
    id: number
    sortNo: number
    sortId: number
    name: string
    readingName: string
    shipTypeId: number
    classId: number
    classNo: number
    minHp: number
    maxHp: number
    minArmor: number
    maxArmor: number
    minFirepower: number
    maxFirepower: number
    minTorpedo: number
    maxTorpedo: number
    minAntiAir: number
    maxAntiAir: number
    minLuck: number
    maxLuck: number
    minAsw: number
    maxAsw: number
    minEvasion: number
    maxEvasion: number
    minLos: number
    maxLos: number
    baseSpeed: number
    baseRange: number
    maxFuel: number
    maxAmmo: number
    slotCapacities: Readonly<number[]>
    equipments: Readonly<TEquipment[]>
    remodel: Readonly<{
      nextId: number
      nextLevel: number
    }>
  }>
  const ships: TShipData[]
  export default ships
}