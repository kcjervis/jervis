import { observer } from 'mobx-react-lite'
import React from 'react'

import { ShipStatKey } from 'kc-calculator'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

import Tooltip from '@material-ui/core/Tooltip'

import StatLabel from '../../components/StatLabel'

import { ObservableShip } from '../../stores'
import statKeys from '../../data/statKeys'
import { useOpen, useBaseStyles } from '../../hooks'

import ShipStatLabel, { useShipStat } from './ShipStatLabel'
import { NumberInput } from '../../components'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      justifyContent: 'start',
      padding: 4
    }
  })
)

interface ShipStatDialogProps {
  ship: ObservableShip
  statKey: ShipStatKey
}

const ShipStatDialog: React.FC<ShipStatDialogProps> = props => {
  const classes = useStyles()
  const baseClasses = useBaseStyles()
  const { open, onOpen, onClose } = useOpen()
  const { stat, nakedStat, totalEquipmentStat, bonus, changeStat, changeIncreasedStat, increasedStat } = useShipStat(
    props
  )
  const { ship, statKey } = props

  const statData = statKeys.find(statData => statData.key === statKey)
  const title = statData && statData.name
  return (
    <div>
      <Tooltip title={title}>
        <Button className={classes.button} onClick={onOpen} fullWidth>
          <ShipStatLabel statKey={statKey} ship={ship} />
        </Button>
      </Tooltip>

      <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
        <DialogContent>
          <Typography variant="subtitle1">{ship.asKcObject.name}</Typography>
          <StatLabel statKey={statKey} stat={stat} bonus={bonus} increased={increasedStat} />
          <Typography>装備無しステータス: {nakedStat}</Typography>
          <Typography>装備合計: {totalEquipmentStat}</Typography>
          <div className={baseClasses.flexbox}>
            <Typography>装備フィット:</Typography>
            <Typography color="secondary">{bonus}</Typography>
          </div>
        </DialogContent>

        <DialogContent className={baseClasses.column}>
          <NumberInput label="表示ステータス" fullWidth value={stat} onChange={changeStat} />
          <NumberInput label="増加ステータス" fullWidth value={increasedStat} onChange={changeIncreasedStat} />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default observer(ShipStatDialog)
