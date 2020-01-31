import { BattleSimulator, DamageCounter, PlaneLossCounter } from "kc-calculator"
import React from "react"
import { SeamapPanelStateContext } from "../Dialogs"

import Button from "@material-ui/core/Button"

import { Text, ShipBanner, Flexbox, NumberInput } from "../../components"
import { toPercent } from "../../utils"

const DamageCounterText: React.FC<{ counter: DamageCounter }> = ({ counter }) => {
  const { sunkRate, taihaRate, chuuhaRate, shouhaRate, lessRate } = counter
  return (
    <Text>
      撃沈: {toPercent(sunkRate)}, 大破: {toPercent(taihaRate)}, 中破: {toPercent(chuuhaRate)}, 小破:{" "}
      {toPercent(shouhaRate)}, 無傷: {toPercent(lessRate)}
    </Text>
  )
}

const PlaneLossCounterText: React.FC<{ counter: PlaneLossCounter }> = ({ counter }) => {
  return (
    <Text>
      {counter
        .entries()
        .sort(([left], [right]) => right - left)
        .map(([slotSize, rate]) => `${slotSize}: ${toPercent(rate)}  `)}
    </Text>
  )
}

const BattleLogPanel: React.FC<{ record: BattleSimulator["record"] }> = ({ record }) => {
  const { damageLog, planeLossLog } = record
  return (
    <>
      {damageLog.entries().map(([ship, counter], index) => {
        return (
          <Flexbox key={index} style={{ margin: 4 }}>
            <ShipBanner size="small" shipId={ship.shipId} />
            <DamageCounterText counter={counter} />
          </Flexbox>
        )
      })}

      {planeLossLog.entries().map(([plane, counter], index) => {
        return (
          <Flexbox key={index} style={{ margin: 4 }}>
            <Text>{plane.gear.name}</Text>
            <PlaneLossCounterText counter={counter} />
          </Flexbox>
        )
      })}
    </>
  )
}

export default BattleLogPanel
