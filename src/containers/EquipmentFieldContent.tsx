import { Proficiency } from 'kc-calculator/dist/objects/Equipment'
import { observer } from 'mobx-react'
import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'

import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import IconButton from '@material-ui/core/IconButton'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Delete from '@material-ui/icons/Delete'

import EquipmentLabel from '../components/EquipmentLabel'
import PopperCard from '../components/PopperCard'
import ProficiencyIcon from '../components/ProficiencyIcon'

import EquipmentCard from '../components/EquipmentCard'
import EquipmentIcon from '../components/EquipmentIcon'
import { CloseButton, RemoveButton, UpdateButton } from '../components/IconButtons'
import ObservableEquipment from '../stores/ObservableEquipment'

const styles = createStyles({
  card: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
    height: '100%'
  },
  buttons: {
    display: 'flex',
    flexDirection: 'column-reverse',
    height: 400,
    marginLeft: 'auto'
  },

  button: {}
})

export interface IEquipmentFieldContentProps extends RouteComponentProps, WithStyles<typeof styles> {
  equipment: ObservableEquipment
  slotSize?: number
  toEquipmentsPage?: (event: React.MouseEvent<HTMLInputElement>) => void
  onSlotSizeChage?: (value: number) => void
  style?: React.CSSProperties
}

interface IEquipmentFieldContentState {
  anchorEl: HTMLElement | null
}

@observer
class EquipmentFieldContent extends React.Component<IEquipmentFieldContentProps, IEquipmentFieldContentState> {
  public state = {
    anchorEl: null
  }

  public handleOpen = (event: React.MouseEvent<HTMLElement>) => this.setState({ anchorEl: event.currentTarget })

  public handleClose = () => this.setState({ anchorEl: null })

  public handleSlotSizeChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    const { onSlotSizeChage } = this.props
    if (onSlotSizeChage) {
      onSlotSizeChage(Number(event.target.value))
    }
  }

  public handleProficiencyClick = (value: number) => () => {
    this.props.equipment.proficiency = value
  }

  public handleProficiencyInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.equipment.proficiency = Number(event.target.value)
  }

  public handleImprovementClick = (value: number) => () => {
    this.props.equipment.improvement = value
  }

  public render() {
    const { anchorEl } = this.state
    const { equipment, slotSize, classes, style } = this.props
    const kcEquipment = equipment.asKcObject
    if (!kcEquipment) {
      return null
    }
    const { isAerialCombatAircraft } = kcEquipment.category

    return (
      <div>
        <div style={style} onClick={this.handleOpen}>
          <EquipmentLabel slotSize={slotSize} equipment={kcEquipment} />
        </div>

        <PopperCard open={Boolean(this.state.anchorEl)} anchorEl={anchorEl} onClickAway={this.handleClose}>
          <div style={{ display: 'flex', position: 'relative' }}>
            <div>
              <EquipmentCard equipment={equipment.asKcObject} style={{ background: 'rgba(255, 255, 255, 0)' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {isAerialCombatAircraft && (
                  <div style={{ position: 'absolute', bottom: 0, left: 144, display: 'flex' }}>
                    <TextField
                      label="slot"
                      variant="outlined"
                      style={{ margin: 4, width: 80 }}
                      inputProps={{ type: 'number', min: 0 }}
                      value={slotSize}
                      onChange={this.handleSlotSizeChange}
                    />
                    <TextField
                      label="内部熟練度"
                      variant="outlined"
                      style={{ margin: 4, width: 80 }}
                      inputProps={{ type: 'number', min: 0, max: 120 }}
                      value={equipment.proficiency}
                      onChange={this.handleProficiencyInput}
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <RemoveButton size="small" onClick={equipment.remove} />
              <UpdateButton size="small" onClick={this.props.toEquipmentsPage} />
              <CloseButton size="small" onClick={this.handleClose} />
              <div style={{ display: 'flex' }}>
                {isAerialCombatAircraft && (
                  <div className={classes.buttons}>
                    {Proficiency.internalBounds.concat(120).map(inter => (
                      <Button key={inter} className={classes.button} onClick={this.handleProficiencyClick(inter)}>
                        <ProficiencyIcon value={inter} />
                      </Button>
                    ))}
                  </div>
                )}

                <div className={classes.buttons}>
                  {Array.from({ length: 11 }).map((_, improve) => (
                    <Button key={improve} className={classes.button} onClick={this.handleImprovementClick(improve)}>
                      <Typography color={improve === equipment.improvement ? 'secondary' : undefined}>
                        ★{improve}
                      </Typography>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </PopperCard>
      </div>
    )
  }
}

export default withStyles(styles)(withRouter(EquipmentFieldContent))
