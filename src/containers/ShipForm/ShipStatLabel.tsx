import { observer } from "mobx-react-lite"
import React, { useCallback } from "react"

import { ShipStatKey } from "kc-calculator"

import StatLabel from "../../components/StatLabel"

import { ObservableShip } from "../../stores"

export const useShipStat = ({ ship, statKey }: { ship: ObservableShip; statKey: ShipStatKey }) => {
  const { stats, nakedStats } = ship.asKcObject
  const stat = stats[statKey]
  const nakedStat = nakedStats[statKey]
  const totalEquipmentStat = ship.asKcObject.totalEquipmentStats(statKey)
  const bonus = stats.statsBonus ? stats.statsBonus[statKey] : 0
  const increasedStat = ship.increased[statKey] || 0
  const rawStat = nakedStat - increasedStat

  const changeIncreasedStat = useCallback(
    (value: number) => {
      if (value) {
        ship.increased[statKey] = value
      } else {
        delete ship.increased[statKey]
      }
      if (statKey === "hp") {
        ship.currentHp = ship.asKcObject.health.maxHp
      }
    },
    [ship, statKey]
  )

  const changeStat = useCallback(
    (nextStat: number) => {
      const deff = nextStat - stat
      changeIncreasedStat(deff + increasedStat)
    },
    [stat, increasedStat, changeIncreasedStat]
  )

  const handleIncreasedStatChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => changeIncreasedStat(Number(event.target.value)),
    [changeIncreasedStat]
  )

  const handleStatChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => changeStat(Number(event.target.value)),
    [changeStat]
  )

  return {
    stat,
    nakedStat,
    totalEquipmentStat,
    bonus,
    changeIncreasedStat,
    changeStat,
    handleIncreasedStatChange,
    handleStatChange,
    increasedStat
  }
}

type ShipStatLabelProps = React.ComponentProps<"div"> & {
  ship: ObservableShip
  statKey: ShipStatKey
}

const ShipStatLabel: React.FC<ShipStatLabelProps> = ({ ship, statKey, ...divProps }) => {
  const { stat, bonus, increasedStat } = useShipStat({ ship, statKey })
  return (
    <StatLabel statKey={statKey} stat={stat} bonus={bonus} increased={increasedStat} disableTooltip {...divProps} />
  )
}

export default observer(ShipStatLabel)
