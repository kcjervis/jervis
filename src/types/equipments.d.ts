declare module '*/equipments' {
  export type TEquipmentTypes = Readonly<number[]>
  export type TEquipmentData = Readonly<{
    id: number
    sortNo: number
    name: string
    types: TEquipmentTypes
    hp: number
    armor: number
    firepower: number
    torpedo: number
    speed: number
    bombing: number
    antiAir: number
    asw: number
    accuracy: number
    evasion: number
    los: number
    luck: number
    range: number
  }>
  const equipments: TEquipmentData[]
  export default equipments
}