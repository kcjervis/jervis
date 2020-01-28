import React from "react"
import { IShip } from "kc-calculator"
import clsx from "clsx"

import Box from "@material-ui/core/Box"
import { makeStyles } from "@material-ui/core/styles"

import { Text } from "../../components"

type Props = {
  className?: string
  ship: IShip
}

const ShipDetailedStats: React.FC<Props> = ({ className, ship }) => {
  return (
    <div className={className}>
      <Text>装備命中: {ship.totalEquipmentStats("accuracy")}</Text>
      <Text>基礎命中項: {ship.shipAccuracy.toFixed(4)}</Text>
      <Text>単縦回避項: {ship.calcEvasionValue(1)}</Text>

      <Text>艦隊索敵因子: {ship.fleetLosFactor}</Text>
    </div>
  )
}

export default ShipDetailedStats
