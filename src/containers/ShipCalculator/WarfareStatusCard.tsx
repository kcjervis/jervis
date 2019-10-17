import React, { useMemo, useState } from "react"
import { ShipInformation, calcDeadlyPower, BattleState } from "kc-calculator"
import { observer } from "mobx-react-lite"

import Box from "@material-ui/core/Box"
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import { makeStyles, createStyles } from "@material-ui/core/styles"

import { toPercent } from "../../utils"
import { Select, Table, Flexbox, NumberInput } from "../../components"
import { useInstallationTypeSelect } from "./ShipStatusCard"
import AttackStatus from "./AttackStatus"
import { ObservableShip } from "../../stores"
import ShipCard from "../ShipForm/ShipCard"

const useStyles = makeStyles(
  createStyles({
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
    }
  })
)

type WarfareStatusCardProps = {
  battleState: BattleState
  shipInformation: ShipInformation
  enemyInformation: ShipInformation
  enemyShip: ObservableShip

  nightContactModifier?: number
  remainingAmmoModifier?: number
  fitGunBonus?: number
  isAttack?: boolean
}

const WarfareStatusCard: React.FC<WarfareStatusCardProps> = props => {
  const {
    battleState,
    shipInformation,
    enemyInformation,
    enemyShip,
    nightContactModifier,
    remainingAmmoModifier,
    fitGunBonus,
    isAttack
  } = props

  const classes = useStyles()

  enemyInformation.ship.stats.luck

  const [eventMapModifier, setEventMapModifier] = useState(1)
  const installationTypeSelect = useInstallationTypeSelect(enemyInformation.ship.installationType)

  let attackStatusNode: React.ReactElement
  if (isAttack) {
    attackStatusNode = (
      <AttackStatus
        battleState={battleState}
        attacker={shipInformation}
        defender={enemyInformation}
        eventMapModifier={eventMapModifier}
        manualInstallationType={installationTypeSelect.value}
        nightContactModifier={nightContactModifier}
        remainingAmmoModifier={remainingAmmoModifier}
        fitGunBonus={fitGunBonus}
      />
    )
  } else {
    attackStatusNode = <AttackStatus battleState={battleState} attacker={enemyInformation} defender={shipInformation} />
  }

  return (
    <Paper className={classes.root}>
      <Box>
        <Flexbox alignItems="end">
          <Select className={classes.enemyTypeSelect} label="敵種別" {...installationTypeSelect} />
          <NumberInput label="イベント特効(a11)" step={0.1} value={eventMapModifier} onChange={setEventMapModifier} />
          <Typography variant="body2">確殺攻撃力: {calcDeadlyPower(enemyInformation.ship).toFixed(4)}</Typography>
        </Flexbox>
        <ShipCard ship={enemyShip} visibleInfo={false} elevation={0} />
      </Box>

      <div className={classes.attackStatus}>{attackStatusNode}</div>
    </Paper>
  )
}

export default observer(WarfareStatusCard)
