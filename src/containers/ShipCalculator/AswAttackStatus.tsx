import React from "react"
import { AswAttack } from "kc-calculator"
import { observer } from "mobx-react-lite"

import Box from "@material-ui/core/Box"
import Typography from "@material-ui/core/Typography"
import Tooltip from "@material-ui/core/Tooltip"
import { makeStyles, createStyles } from "@material-ui/core/styles"

import { toPercent } from "../../utils"
import { Table, LabeledValue } from "../../components"
import { ColumnProps } from "../../components/Table"
import HitRateText, { damageToText } from "./HitRateText"

type AswAttackStatusProps = Omit<ConstructorParameters<typeof AswAttack>[0], "isCritical">

export default function AswAttackStatus(props: AswAttackStatusProps) {
  const { attacker, defender } = props
  if (!AswAttack.isPossible(attacker.ship, defender.ship)) {
    return <Typography>不可</Typography>
  }

  const createAttack = (isCritical = false) => new AswAttack({ ...props, isCritical })
  const { accuracy, evasion, hitRate } = createAttack()

  const hitRateCellRenderer = () => {
    return (
      <HitRateText
        hitRate={hitRate.hitRate}
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
    </div>
  )
}
