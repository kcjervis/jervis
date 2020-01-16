import React, { useMemo, useState } from "react"
import { ShipInformation, calcDeadlyPower, BattleState, AttackPowerModifierRecord } from "kc-calculator"
import { observer } from "mobx-react-lite"

import Box from "@material-ui/core/Box"
import Paper from "@material-ui/core/Paper"
import { makeStyles } from "@material-ui/core/styles"

import { toPercent } from "../../utils"
import { Text, Table, Flexbox, NumberInput } from "../../components"
import AttackStatus from "./AttackStatus"
import { ObservableShip } from "../../stores"
import ShipCard from "../ShipForm/ShipCard"

const useStyles = makeStyles({
  root: {
    padding: 8,
    display: "flex"
  },
  enemyTypeSelect: {
    minWidth: 80,
    marginLeft: 8
  },
  attackStatus: {
    margin: 8
  },
  shipCard: {
    backgroundColor: "rgba(0, 0, 0, 0)"
  }
})

type WarfareStatusCardProps = {
  battleState: BattleState
  shipInformation: ShipInformation
  enemyInformation: ShipInformation
  enemyShip: ObservableShip

  starshell: boolean
  searchlight: boolean
  nightContactModifier?: number

  remainingAmmoModifier?: number
  optionalPowerModifiers?: AttackPowerModifierRecord
  fitGunBonus?: number
  isAttack?: boolean
}

const WarfareStatusCard: React.FC<WarfareStatusCardProps> = props => {
  const {
    battleState,
    shipInformation,
    enemyInformation,
    enemyShip,
    starshell,
    searchlight,
    nightContactModifier,
    remainingAmmoModifier,
    optionalPowerModifiers,
    fitGunBonus,
    isAttack
  } = props

  const classes = useStyles()

  let attackStatusNode: React.ReactElement
  if (isAttack) {
    attackStatusNode = (
      <AttackStatus
        battleState={battleState}
        attacker={shipInformation}
        defender={enemyInformation}
        starshell={starshell}
        searchlight={searchlight}
        nightContactModifier={nightContactModifier}
        remainingAmmoModifier={remainingAmmoModifier}
        optionalPowerModifiers={optionalPowerModifiers}
        fitGunBonus={fitGunBonus}
      />
    )
  } else {
    attackStatusNode = (
      <AttackStatus
        battleState={battleState}
        attacker={enemyInformation}
        defender={shipInformation}
        starshell={false}
        searchlight={false}
      />
    )
  }

  return (
    <Paper className={classes.root}>
      <Box>
        <ShipCard className={classes.shipCard} ship={enemyShip} visibleInfo={false} elevation={0} />
        <Text>確殺攻撃力: {calcDeadlyPower(enemyInformation.ship).toFixed(4)}</Text>
      </Box>

      <div className={classes.attackStatus}>{attackStatusNode}</div>
    </Paper>
  )
}

export default observer(WarfareStatusCard)
