import { observer } from 'mobx-react'
import React from 'react'

import { ShipStatKey } from 'kc-calculator'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Grid from '@material-ui/core/Grid'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import StatLabel from '../../components/StatLabel'

import { ObservableShip } from '../../stores'

const styles = createStyles({
  root: {
    display: 'flex',
    alignItems: 'center'
  }
})

interface ShipStatDialogProps extends WithStyles<typeof styles> {
  ship: ObservableShip
  statKey: ShipStatKey
}

@observer
class ShipStatDialog extends React.Component<ShipStatDialogProps> {
  public state = { open: false }

  public handleClickOpen = () => this.setState({ open: true })

  public handleClose = () => this.setState({ open: false })

  public handleStatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { ship, statKey } = this.props
    const value = Number(event.target.value)
    if (value) {
      ship.increased[statKey] = value
    } else {
      delete ship.increased[statKey]
    }
    if (statKey === 'hp') {
      ship.nowHp = ship.asKcObject.health.maxHp
    }
  }

  public render() {
    const { statKey, ship, classes } = this.props
    const { stats, nakedStats } = ship.asKcObject

    const stat = stats[statKey]
    const nakedStat = nakedStats[statKey]
    const increasedStat = ship.increased[statKey]
    const { statsBonus } = stats

    let statBonusLabel = 0
    if (statsBonus && statKey in statsBonus) {
      statBonusLabel = (statsBonus as any)[statKey]
    }

    const totalEquipmentStat = ship.asKcObject.totalEquipmentStats(statKey)
    return (
      <div>
        <Button className={classes.root} onClick={this.handleClickOpen}>
          <StatLabel statKey={statKey} stat={stat} increasedStat={increasedStat} />
        </Button>

        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          PaperProps={{ style: { background: 'rgba(0, 0, 0, 0.8)' } }}
        >
          <DialogContent>
            <Typography variant="subtitle1">{ship.asKcObject.name}</Typography>
            <StatLabel statKey={statKey} stat={stat} increasedStat={increasedStat} />
            <Typography>装備無しステータス: {nakedStat}</Typography>
            <Typography>装備合計: {totalEquipmentStat}</Typography>
            <Typography>装備フィット: {statBonusLabel}</Typography>
          </DialogContent>

          <DialogContent>
            <TextField
              label="増加ステータス"
              value={increasedStat ? increasedStat : 0}
              type="number"
              onChange={this.handleStatChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default withStyles(styles)(ShipStatDialog)
