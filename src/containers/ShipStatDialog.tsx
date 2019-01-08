import { observer } from 'mobx-react'
import React from 'react'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Grid from '@material-ui/core/Grid'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import ShipStat from '../components/ShipStat'

import { ObservableShip } from '../stores'

type ShipStatName =
  | 'hp'
  | 'armor'
  | 'firepower'
  | 'torpedo'
  | 'speed'
  | 'antiAir'
  | 'asw'
  | 'evasion'
  | 'los'
  | 'luck'
  | 'range'

const styles = createStyles({
  root: {
    display: 'flex',
    alignItems: 'center'
  }
})

interface IShipStatDialog extends WithStyles<typeof styles> {
  ship: ObservableShip
  statName: ShipStatName
}

@observer
class ShipStatDialog extends React.Component<IShipStatDialog> {
  public state = { open: false }

  public handleClickOpen = () => this.setState({ open: true })

  public handleClose = () => this.setState({ open: false })

  public handleStatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { ship, statName } = this.props
    const value = Number(event.target.value)
    if (value) {
      ship.increased[statName] = value
    } else {
      delete ship.increased[statName]
    }
  }

  public render() {
    const { statName, ship, classes } = this.props
    const { stats, nakedStats } = ship.asKcObject

    const stat = stats[statName]
    const nakedStat = nakedStats[statName]
    const increasedStat = ship.increased[statName]
    return (
      <div>
        <Button className={classes.root} onClick={this.handleClickOpen}>
          <ShipStat statName={statName} stat={stat} increasedStat={increasedStat} />
        </Button>

        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          PaperProps={{ style: { background: 'rgba(0, 0, 0, 0.8)' } }}
        >
          <DialogContent>
            <Typography variant="subtitle1">{ship.asKcObject.name}</Typography>
            <ShipStat statName={statName} stat={stat} increasedStat={increasedStat} />
            <Typography>装備無しステータス: {nakedStat}</Typography>
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
