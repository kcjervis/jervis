declare module '*/start2' {
  export type TStatTuple = [number, number]

  type TApiSlotCapacity = [number, number, number, number, number]

  type TApiMaterials = [number, number, number, number]

  type TEquipmentTypeIds = [number, number, number, number, number]

  export type TApiAbysallShip = {
    "api_id": number,
    "api_sort_id": number,
    "api_name": string,
    "api_yomi": string,
    "api_stype": number,
    "api_ctype": number,
    "api_soku": number,
    "api_slot_num": number
  }

  export type TApiShip = TApiAbysallShip | {
    "api_id": number,
    "api_sortno": number,
    "api_sort_id": number,
    "api_name": string,
    "api_yomi": string,
    "api_stype": number,
    "api_ctype": number,
    "api_afterlv": number,
    "api_aftershipid": string,
    "api_taik": TStatTuple,
    "api_souk": TStatTuple,
    "api_houg": TStatTuple,
    "api_raig": TStatTuple,
    "api_tyku": TStatTuple,
    "api_tais"?: [number],
    "api_luck": TStatTuple,
    "api_soku": number,
    "api_leng": number,
    "api_slot_num": number,
    "api_maxeq": TApiSlotCapacity,
    "api_buildtime": number,
    "api_broken": TApiMaterials,
    "api_powup": TApiMaterials,
    "api_backs": number,
    "api_getmes": string,
    "api_afterfuel": number,
    "api_afterbull": number,
    "api_fuel_max": number,
    "api_bull_max": number,
    "api_voicef": number
  }

  type TApiEquipmentCategory = {
    "api_id": number,
    "api_name": string,
    "api_show_flg": number
  }

  type TApiReinforceExpansionShip = {
    "api_slotitem_id": number,
    "api_ship_ids": number[]
  }

  type TApiShipCategory = {
    "api_id": number,
    "api_sortno": number,
    "api_name": string,
    "api_scnt": number,
    "api_kcnt": number,
    "api_equip_type": number[]
  }

  type TApiEquipment = {
    "api_id": number,
    "api_sortno": number,
    "api_name": string,
    "api_type": TEquipmentTypeIds,
    "api_taik": number,
    "api_souk": number,
    "api_houg": number,
    "api_raig": number,
    "api_soku": number,
    "api_baku": number,
    "api_tyku": number,
    "api_tais": number,
    "api_atap": number,
    "api_houm": number,
    "api_raim": number,
    "api_houk": number,
    "api_raik": number,
    "api_bakk": number,
    "api_saku": number,
    "api_sakb": number,
    "api_luck": number,
    "api_leng": number,
    "api_rare": number,
    "api_broken": TApiMaterials,
    "api_info": string,
    "api_usebull": string,
    "api_version": number
  }

  type TApiMapArea = {
    "api_id": number,
    "api_name": string,
    "api_type": number
  }

  type TApiMapInfo = {
    "api_id": number,
    "api_maparea_id": number,
    "api_no": number,
    "api_name": string,
    "api_level": number,
    "api_opetext": string,
    "api_infotext": string,
    "api_item": [number, number, number, number],
    "api_max_maphp": number | null,
    "api_required_defeat_count": number | null,
    "api_sally_flag": [number, number, number]
  }

  type TStart2 = {
    api_result: number
    api_result_msg: string
    api_data: {
      api_mst_ship: Array<TApiShip | TApiAbysallShip>
      api_mst_stype: TApiShipCategory[]
      api_mst_slotitem: TApiEquipment[]
      api_mst_slotitem_equiptype: TApiEquipmentCategory[]
      api_mst_equip_exslot: number[]
      api_mst_equip_exslot_ship: TApiReinforceExpansionShip[]
      api_mst_maparea: TApiMapArea[]
      api_mst_mapinfo: TApiMapInfo[]
    }
  }
  const start2: TStart2
  export default start2
}