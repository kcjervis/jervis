import React, { useMemo, useState } from 'react'
import { ShipInformation, calcDeadlyPower, BattleState } from 'kc-calculator'
import { observer } from 'mobx-react-lite'

import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { makeStyles, createStyles } from '@material-ui/core/styles'

import { toPercent } from '../../utils'
import { Select, Table, Flexbox, NumberInput } from '../../components'
import { useInstallationTypeSelect } from './ShipStatusCard'
import AttackStatus from './AttackStatus'
import { ObservableShip } from '../../stores'
import ShipCard from '../ShipForm/ShipCard'

const useStyles = makeStyles(
  createStyles({
    root: {
      padding: 8
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
  isExperiment: boolean
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
    isExperiment
  } = props

  const classes = useStyles()

  enemyInformation.ship.stats.luck

  const [eventMapModifier, setEventMapModifier] = useState(1)
  const installationTypeSelect = useInstallationTypeSelect(enemyInformation.ship.installationType)

  return (
    <Paper className={classes.root}>
      <Flexbox flexWrap="wrap">
        <ShipCard ship={enemyShip} visibleInfo={false} elevation={0} />
        <Flexbox ml={4} alignItems="end" justifyContent="center">
          <Select label="敵種別" style={{ minWidth: 80, marginLeft: 8 }} {...installationTypeSelect} />
          <NumberInput
            label="イベント特効(a11)"
            style={{ width: 8 * 17 }}
            step={0.1}
            value={eventMapModifier}
            onChange={setEventMapModifier}
          />

          {isExperiment && (
            <Typography variant="caption">確殺攻撃力: {calcDeadlyPower(enemyInformation.ship)}</Typography>
          )}
        </Flexbox>
      </Flexbox>

      <Flexbox flexWrap="wrap" justifyContent="space-between">
        <AttackStatus
          battleState={battleState}
          attacker={shipInformation}
          defender={enemyInformation}
          eventMapModifier={eventMapModifier}
          manualInstallationType={installationTypeSelect.value}
          nightContactModifier={nightContactModifier}
          remainingAmmoModifier={remainingAmmoModifier}
          fitGunBonus={fitGunBonus}
          isExperiment={isExperiment}
        />
        <AttackStatus
          battleState={battleState}
          attacker={enemyInformation}
          defender={shipInformation}
          isExperiment={isExperiment}
        />
      </Flexbox>
    </Paper>
  )
}

export default observer(WarfareStatusCard)
