import { ObservableShip, ObservableLandBasedAirCorps } from '../stores'
import { useMemo, useCallback } from 'react'
import { IEquipment } from 'kc-calculator'

type EquipableProps = {
  store: ObservableShip | ObservableLandBasedAirCorps
  index: number
}

const useEquipmentSelect = (props: EquipableProps) => {
  const { store, index } = props
  const label = useMemo(() => {
    if (store instanceof ObservableShip) {
      return `${store.asKcObject.name} 選択中`
    } else if (store instanceof ObservableLandBasedAirCorps) {
      return '基地航空隊 選択中'
    }
    return ''
  }, [store])

  const onSelect = useCallback(
    (equipment: IEquipment) => {
      const { category, masterId } = equipment
      let proficiency = 0
      if (category.isAerialCombatAircraft) {
        proficiency = 100
      }
      if (category.isReconnaissanceAircraft) {
        proficiency = 120
      }
      if (masterId > 500 || category.is('LandBasedReconnaissanceAircraft')) {
        proficiency = 0
      }
      store.createEquipment(index, {
        masterId: equipment.masterId,
        proficiency,
        improvement: equipment.improvement.value
      })
    },
    [store, index]
  )

  const filter = useCallback((equipment: IEquipment) => store.canEquip(equipment, index), [store, index])

  return { label, onSelect, filter }
}

export default useEquipmentSelect
