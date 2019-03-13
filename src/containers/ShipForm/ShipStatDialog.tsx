import { observer } from 'mobx-react-lite'
import React, { useCallback, useEffect } from 'react'

import { ShipStatKey } from 'kc-calculator'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import StatLabel from '../../components/StatLabel'

import { ObservableShip } from '../../stores'
import { useOpen, useBaseStyles } from '../../hooks'

interface ShipStatDialogProps {
  ship: ObservableShip
  statKey: ShipStatKey
}

const useShipStat = ({ ship, statKey }: ShipStatDialogProps) => {
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
      if (statKey === 'hp') {
        ship.nowHp = ship.asKcObject.health.maxHp
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

  return { stat, nakedStat, totalEquipmentStat, bonus, handleIncreasedStatChange, handleStatChange, increasedStat }
}

const ShipStatDialog: React.FC<ShipStatDialogProps> = props => {
  const classes = useBaseStyles()
  const { open, onOpen, onClose } = useOpen()
  const {
    stat,
    nakedStat,
    totalEquipmentStat,
    bonus,
    handleStatChange,
    handleIncreasedStatChange,
    increasedStat
  } = useShipStat(props)
  const { ship, statKey } = props

  return (
    <div>
      <Button className={classes.flexbox} onClick={onOpen}>
        <StatLabel statKey={statKey} stat={stat} bonus={bonus} increased={increasedStat} />
      </Button>

      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="form-dialog-title"
        PaperProps={{ style: { background: 'rgba(0, 0, 0, 0.8)' } }}
      >
        <DialogContent>
          <Typography variant="subtitle1">{ship.asKcObject.name}</Typography>
          <StatLabel statKey={statKey} stat={stat} bonus={bonus} increased={increasedStat} />
          <Typography>装備無しステータス: {nakedStat}</Typography>
          <Typography>装備合計: {totalEquipmentStat}</Typography>
          <div className={classes.flexbox}>
            <Typography>装備フィット:</Typography>
            <Typography color="secondary">{bonus}</Typography>
          </div>
        </DialogContent>

        <DialogContent className={classes.column}>
          <TextField label="表示ステータス" value={stat} type="number" onChange={handleStatChange} />
          <TextField label="増加ステータス" value={increasedStat} type="number" onChange={handleIncreasedStatChange} />
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
