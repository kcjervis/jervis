import React from 'react'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Add from '@material-ui/icons/Add'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import Tooltip from '@material-ui/core/Tooltip'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'

import { actions as entitiesActions } from '../redux/modules/entities'
import selectors from '../redux/modules/entities/selectors'
import withDragAndDrop from '../hocs/withDragAndDrop'

const OnMouseOver = props => {
  return <FormControl />
}

const styles = theme => ({
  card: {
    display: 'flex',
    alignItems: 'center',
    width: `15vw`,
    height: 50,
    marginLeft: theme.spacing.unit
  },
  typography: {
    fontSize: 12
  }
})

class EquipmentCard extends React.Component {
  state = { open: false }
  setEquipmentClick = () => {
    const { shipsId, index } = this.props
    this.props.history.push('./equipments', { shipsId, index })
  }
  handleClick = event => this.setState({ open: true })
  handleClickAway = () => this.setState({ open: false })
  handleClose = () => this.setState({ open: false })

  render() {
    const {
      shipsId,
      equipmentsId,
      index,
      slotSize,
      equipment,
      classes,
      history,
      entitiesActions
    } = this.props
    if (!equipment) {
      return (
        <Button className={classes.card} onClick={this.setEquipmentClick}>
          <Add />
          {`装備(${index === 'expansionEquipment' ? '補強増設' : slotSize})`}
        </Button>
      )
    }
    const { improvement = 0, proficiency = 0 } = equipment
    return (
      <div>
        <ClickAwayListener onClickAway={this.handleClose}>
          <Tooltip
            PopperProps={{
              disablePortal: true
            }}
            onClose={this.handleClose}
            open={this.state.open}
            disableFocusListener
            disableHoverListener
            disableTouchListener
            title={
              <div>
                <p>aaaaaaaa</p>
                <p>aaaaaaaa</p>
                <p>aaaaaaaa</p>
              </div>
            }
          >
            <Card
              square
              className={classes.card}
              elevation={0}
              onClick={this.handleClick}
            >
              <img src={equipment.image.icon} />
              <Typography className={classes.typography}>
                {equipment.name}
              </Typography>
              <div style={{ margin: 5, marginLeft: 'auto' }}>
                <Typography className={classes.typography}>
                  {'★' + improvement}
                </Typography>
                <Typography className={classes.typography}>
                  {slotSize}
                </Typography>
              </div>
            </Card>
          </Tooltip>
        </ClickAwayListener>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  equipment: selectors.equipmentSelector(state, props)
})

const mapDispatchToProps = dispatch => ({
  entitiesActions: bindActionCreators(entitiesActions, dispatch),
  onEndDrag: payload => dispatch(entitiesActions.changeEquipmentIndex(payload))
})

export default compose(
  withStyles(styles),
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withDragAndDrop('EquipmentCard')
)(EquipmentCard)
