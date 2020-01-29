import React, { useState } from "react"
import { TorpedoAttack } from "kc-calculator"
import { observer } from "mobx-react-lite"

import Box from "@material-ui/core/Box"
import Typography from "@material-ui/core/Typography"
import Tooltip from "@material-ui/core/Tooltip"
import { makeStyles, createStyles } from "@material-ui/core/styles"

import { toPercent } from "../../utils"
import { Table, NumberInput } from "../../components"
import { ColumnProps } from "../../components/Table"
import HitRateText, { damageToText } from "./HitRateText"

type TorpedoAttackStatusProps = Omit<ConstructorParameters<typeof TorpedoAttack>[0], "isCritical">

export default function TorpedoAttackStatus(props: TorpedoAttackStatusProps) {
  const { attacker, defender } = props
  const [innateTorpedoAccuracy, setInnateTorpedoAccuracy] = useState(0)
  if (!TorpedoAttack.isPossible(attacker.ship, defender.ship)) {
    return <Typography>不可</Typography>
  }
  const createAttack = (isCritical = false) => new TorpedoAttack({ ...props, isCritical, innateTorpedoAccuracy })
  const { accuracy, evasion, hitRate } = createAttack()

  const hitRateCellRenderer = () => {
    return (
      <HitRateText
        hitRate={hitRate.total}
        criticalRate={hitRate.criticalRate}
        accuracyValue={accuracy}
        evasionValue={evasion}
      />
    )
  }

  const damageCellRenderer = (isCritical: boolean) => () => {
    const { damage } = createAttack(isCritical)
    return damageToText(damage)
  }

  return (
    <div>
      <Table
        data={[0]}
        columns={[
          { label: "命中率(クリ率)", getValue: hitRateCellRenderer },
          { label: "ダメージ", getValue: damageCellRenderer(false) },
          { label: "クリティカル", getValue: damageCellRenderer(true) }
        ]}
      />
      <NumberInput label="雷撃命中" value={innateTorpedoAccuracy} onChange={setInnateTorpedoAccuracy} />
    </div>
  )
}
