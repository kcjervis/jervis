import { ObservableShip, ObservableLandBasedAirCorps } from "../stores"
import { useMemo, useCallback } from "react"
import { IGear } from "kc-calculator"

type EquippableProps = {
  store: ObservableShip | ObservableLandBasedAirCorps
  index: number
}

const useGearSelect = (props: EquippableProps) => {
  const { store, index } = props
  const label = useMemo(() => {
    if (store instanceof ObservableShip) {
      return `${store.asKcObject.name} 選択中`
    } else if (store instanceof ObservableLandBasedAirCorps) {
      return "基地航空隊 選択中"
    }
    return ""
  }, [store])

  const onSelect = useCallback(
    (gear: IGear) => {
      const { category, masterId } = gear
      let proficiency = 0
      if (gear.is("DiveBomber") || gear.is("TorpedoBomber") || gear.is("Fighter")) {
        proficiency = 100
      }
      if (gear.is("ReconnaissanceAircraft")) {
        proficiency = 120
      }
      if (masterId > 500 || category.is("LandBasedReconnaissanceAircraft")) {
        proficiency = 0
      }
      store.createGear(index, {
        masterId: gear.masterId,
        proficiency,
        improvement: gear.improvement.value
      })
    },
    [store, index]
  )

  const filter = useCallback((gear: IGear) => store.canEquip(gear, index), [store, index])

  return { label, onSelect, filter }
}

export default useGearSelect
