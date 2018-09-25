declare module '*/equipments' {
  export type TEquipmentTypeIds = Readonly<number[]>
  export type TEquipmentData = Readonly<{
    id: number
    sortNo: number
    name: string
    typeIds: TEquipmentTypeIds
    hp?: number
    armor?: number
    firepower?: number
    torpedo?: number
    speed?: number
    bombing?: number
    antiAir?: number
    asw?: number
    accuracy?: number
    evasion?: number
    los?: number
    luck?: number
    range?: number
    radius?: number
  }>
  const equipments: TEquipmentData[]
  export default equipments
}