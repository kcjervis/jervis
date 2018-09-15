import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'

import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import Fade from '@material-ui/core/Fade'
import Paper from '@material-ui/core/Paper'
import Popper from '@material-ui/core/Popper'
import { StyleRulesCallback, withStyles, WithStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import EquipmentCard from '../components/EquipmentCard'
import EquipmentIcon from '../components/EquipmentIcon'

import EquipmentModel from '../calculator/Equipment'
import MasterData from '../data'

import { actions } from '../redux/modules/orm'

const buttonTypes = [
  { iconId: 1, categoryIds: [1] },
  { iconId: 2, categoryIds: [2] },
  { iconId: 3, categoryIds: [3] },
  { iconId: 4, categoryIds: [4] },
  { iconId: 5, categoryIds: [5, 22, 32] },
  { iconId: 6, categoryIds: [6, 56] },
  { iconId: 7, categoryIds: [7, 57] },
  { iconId: 8, categoryIds: [8, 58] },
  { iconId: 9, categoryIds: [9, 59, 94] },
  { iconId: 10, categoryIds: [10, 11, 25, 26, 41, 45] },
  { iconId: 11, categoryIds: [12, 13, 93] },
  { iconId: 15, categoryIds: [21] },
  { iconId: 17, categoryIds: [14, 15, 40] },
  { iconId: 20, categoryIds: [24, 30, 46] },
  { iconId: 34, categoryIds: [43, 44] },
  { iconId: 37, categoryIds: [47, 48] }
]

const isOtherCategoryId = (id: number) => {
  for (const { categoryIds } of buttonTypes) {
    if (categoryIds.includes(id)) {
      return false
    }
  }
  return true
}

const styles: StyleRulesCallback = theme => ({
  equipmentButtons: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  equipmentButton: {
    display: 'flex',
    justifyContent: 'flex-start',
    width: 300,
    textTransform: 'none'
  }
})

interface IEquipmentsPageProps extends WithStyles, RouteComponentProps<{}> {
  upsertEquipment: (payload: object) => void
}

interface IEquipmentsPageState {
  selectedIconId: number | string
  visibleAbysall: boolean
  anchorEl: HTMLElement | null
  equipment: EquipmentModel | null
}

class EquipmentsPage extends React.Component<IEquipmentsPageProps, IEquipmentsPageState> {
  public state = { selectedIconId: 1, visibleAbysall: false, anchorEl: null, equipment: null }

  public baseEquipments = MasterData.allEquipmentIds.map(EquipmentModel.createEquipmentById).sort((equip1, equip2) => {
    const iconIdDiff = equip1.type.iconId - equip2.type.iconId
    if (iconIdDiff) {
      return iconIdDiff
    }
    return equip1.masterId - equip2.masterId
  })

  public selectIconId = (selectedIconId: number | string) => () => this.setState({ selectedIconId })

  public toggleAbysall = () => this.setState(({ visibleAbysall }) => ({ visibleAbysall: !visibleAbysall }))

  public selectEquipment = (equipment: EquipmentModel) => () => {
    const { history, location, upsertEquipment } = this.props
    if (!location.state) {
      return
    }

    const { masterId } = equipment
    const payload = { ...location.state, masterId }
    // if (equipment.isAerialCombatPlane) {
    //   payload.internalProficiency = 120
    // }
    // if (equipment.isAttacker || equipment.isBomber) {
    //   payload.internalProficiency = 100
    // }
    upsertEquipment(payload)
    history.go(-1)
  }

  public handleEquipmentCardOpen = (equipment: EquipmentModel): React.MouseEventHandler<HTMLElement> => event => {
    this.setState({ anchorEl: event.currentTarget, equipment })
  }

  public handleEquipmentCardClose = () => {
    this.setState({ anchorEl: null, equipment: null })
  }

  public render() {
    const { selectedIconId, visibleAbysall, anchorEl, equipment } = this.state
    const { classes } = this.props

    const visibleType = buttonTypes.find(({ iconId }) => iconId === selectedIconId)
    const visibleEquipments = this.baseEquipments.filter(equip => {
      const { isAbysall } = equip
      const { categoryId } = equip.type
      if (visibleType) {
        if (!visibleType.categoryIds.includes(categoryId)) {
          return false
        }
      } else {
        if (!isOtherCategoryId(categoryId)) {
          return false
        }
      }
      if (visibleAbysall) {
        return isAbysall
      } else {
        return !isAbysall
      }
    })
    return (
      <Paper>
        <Checkbox onClick={this.toggleAbysall} />
        <div>
          {buttonTypes.map(({ iconId }) => (
            <Button key={iconId} onClick={this.selectIconId(iconId)}>
              <EquipmentIcon iconId={iconId} />
            </Button>
          ))}
          <Button onClick={this.selectIconId('other')}>他</Button>
        </div>

        {/*装備一覧*/}
        <div className={classes.equipmentButtons}>
          {visibleEquipments.map((equip, index) => (
            <Button
              className={classes.equipmentButton}
              key={index}
              onClick={this.selectEquipment(equip)}
              onMouseEnter={this.handleEquipmentCardOpen(equip)}
              onMouseLeave={this.handleEquipmentCardClose}
            >
              <EquipmentIcon iconId={equip.type.iconId} />
              <Typography align="left">{equip.name}</Typography>
            </Button>
          ))}
        </div>

        {/*装備カードポップアップ*/}
        <Popper
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          transition={true}
          style={{
            pointerEvents: 'none'
          }}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper>{equipment && <EquipmentCard equipment={equipment} />}</Paper>
            </Fade>
          )}
        </Popper>
      </Paper>
    )
  }
}

export default connect(
  null,
  { upsertEquipment: actions.upsertEquipment }
)(withStyles(styles)(EquipmentsPage))
