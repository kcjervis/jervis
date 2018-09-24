import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import { Dispatch } from 'redux'

import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Fade from '@material-ui/core/Fade'
import Popper from '@material-ui/core/Popper'
import { StyleRulesCallback, withStyles, WithStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Add from '@material-ui/icons/Add'

import EquipmentCard from '../components/EquipmentCard'
import EquipmentIcon from '../components/EquipmentIcon'
import ProficiencyIcon from '../components/ProficiencyIcon'

import withDragAndDrop from '../hocs/withDragAndDrop'
import { actions, selectors } from '../redux/modules/orm'

import { EquipmentModel } from '../calculator'
import { RootState } from '../types'

const styles: StyleRulesCallback = theme => ({
  card: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    width: '100%',
    height: '100%',
    '&:hover': {
      filter: 'brightness(120%)'
    }
  },
  typography: {
    fontSize: 12
  }
})

interface IEquipmentLabelProps extends WithStyles, RouteComponentProps<{}> {
  equipment?: EquipmentModel
  slotSize?: number
  index: number | string
  shipId?: number
  landBasedAirCorpsId?: number
  className?: string
  isReinforceExpansion?: boolean
  removeEquipment: (equipmentId: number) => void
  updateEquipment: (payload: { id: number; improvement?: number; internalProficiency?: number }) => void
}

interface IEquipmentLabelState {
  open: boolean
  anchorEl: HTMLElement | null
}

class EquipmentLabel extends React.Component<IEquipmentLabelProps, IEquipmentLabelState> {
  public state = { open: false, anchorEl: null }

  public handleClick: React.MouseEventHandler<HTMLElement> = ({ currentTarget }) =>
    this.setState({ open: true, anchorEl: currentTarget })

  public handleClose = () => this.setState({ open: false, anchorEl: null })

  public handleAddEquipment = () => {
    const { shipId, landBasedAirCorpsId, index, history } = this.props
    history.push('./equipments', { shipId, landBasedAirCorpsId, index })
  }

  public handleReselect = () => {
    const { equipment, history } = this.props
    if (equipment) {
      history.push('./equipments', { id: equipment.id })
    }
  }

  public handleRemove = () => {
    const { equipment } = this.props
    if (equipment && typeof equipment.id === 'number') {
      this.props.removeEquipment(equipment.id)
    }
  }

  public render() {
    const { slotSize, equipment, classes, className, isReinforceExpansion } = this.props
    if (!equipment) {
      return (
        <div className={className}>
          <Button className={classes.card} onClick={this.handleAddEquipment}>
            <Add />
            {`装備(${isReinforceExpansion ? '補強増設' : slotSize})`}
          </Button>
        </div>
      )
    }

    const { open, anchorEl } = this.state
    const { improvement, internalProficiency } = equipment
    return (
      <div className={className}>
        {/*装備ラベル*/}
        <Card className={classes.card} elevation={0} onClick={this.handleClick}>
          <EquipmentIcon iconId={equipment.type.iconId} />
          <Typography className={classes.typography}>{equipment.name}</Typography>
          <div style={{ display: 'flex', marginLeft: 'auto' }}>
            {internalProficiency > 0 && <ProficiencyIcon internalProficiency={internalProficiency} />}
            <div style={{ margin: 5 }}>
              <Typography className={classes.typography}>{'★' + improvement}</Typography>
              <Typography className={classes.typography}>{slotSize}</Typography>
            </div>
          </div>
        </Card>

        {/*装備カードポップアップ*/}
        <Popper id={open ? 'simple-popper' : undefined} open={open} anchorEl={anchorEl} transition={true}>
          {({ TransitionProps }) => (
            <ClickAwayListener onClickAway={this.handleClose}>
              <Fade {...TransitionProps} timeout={500}>
                <div>
                  <EquipmentCard
                    equipment={equipment}
                    onRemove={this.handleRemove}
                    onReselect={this.handleReselect}
                    onClose={this.handleClose}
                    updateEquipment={this.props.updateEquipment}
                  />
                </div>
              </Fade>
            </ClickAwayListener>
          )}
        </Popper>
      </div>
    )
  }
}

interface IEquipmentLabelConnectedProps {
  equipmentId?: number
  slotSize?: number
  index: number
  shipId?: number
  landBasedAirCorpsId?: number
  className?: string
}

const mapStateToProps = (state: RootState, props: IEquipmentLabelConnectedProps) => ({
  equipment: selectors.equipmentSelector(state, props)
})

const mapDispatchToProps = (dispatch: Dispatch, props: IEquipmentLabelConnectedProps) => ({
  updateEquipment(payload: { id: number; improvement?: number; internalProficiency?: number }) {
    dispatch(actions.updateEquipment(payload))
  },
  removeEquipment(equipmentId: number) {
    dispatch(actions.removeEquipment(equipmentId))
  },
  onEndDrag({
    dragProps,
    dropProps
  }: {
    dragProps: IEquipmentLabelConnectedProps
    dropProps: IEquipmentLabelConnectedProps
  }) {
    dispatch(actions.swapEquipments([dragProps, dropProps]))
  }
})

const WithStyles = withStyles(styles)(EquipmentLabel)
const WithRouter = withRouter(WithStyles)
const WithDragAndDrop = withDragAndDrop('EquipmentLabel')(WithRouter)
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WithDragAndDrop)
