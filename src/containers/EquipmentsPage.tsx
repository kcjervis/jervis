import { IEquipment, IEquipmentDataObject, MasterEquipment } from 'kc-calculator'
import React from 'react'
import { RouteComponentProps } from 'react-router'

import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import Fade from '@material-ui/core/Fade'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Paper from '@material-ui/core/Paper'
import Popper from '@material-ui/core/Popper'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import EquipmentCard from '../components/EquipmentCard'
import EquipmentIcon from '../components/EquipmentIcon'

import { inject } from 'mobx-react'
import stores, { ObservableLandBasedAirCorps, ObservableShip } from '../stores'
import kcObjectFactory, { masterData } from '../stores/kcObjectFactory'

const masterEquipments = masterData.equipments.sort((equip1, equip2) => {
  const iconIdDiff = equip1.iconId - equip2.iconId
  if (iconIdDiff !== 0) {
    return iconIdDiff
  }
  return equip1.id - equip2.id
})

const buttonTypes = [
  { iconId: 1, categoryIds: [1] },
  { iconId: 2, categoryIds: [2] },
  { iconId: 3, categoryIds: [3] },
  { iconId: 4, categoryIds: [4] },
  { iconId: 5, categoryIds: [5, 22, 32] },
  { iconId: 6, categoryIds: [6, 56] },
  { iconId: 7, categoryIds: [7, 57] },
  { iconId: 8, categoryIds: [8, 58] },
  { iconId: 9, categoryIds: [9, 59, 94, 49] },
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

const styles = createStyles({
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

interface IEquipmentsPageProps extends WithStyles<typeof styles>, RouteComponentProps<{}> {
  parent?: ObservableShip | ObservableLandBasedAirCorps
  createEquipment?: (payload: IEquipmentDataObject) => void
}

interface IEquipmentsPageState {
  selectedIconId: number | string
  visibleAbysall: boolean
  anchorEl: HTMLElement | null
  equipment: IEquipment | null
}

class EquipmentsPage extends React.Component<IEquipmentsPageProps, IEquipmentsPageState> {
  constructor(props: IEquipmentsPageProps) {
    super(props)
    let selectedIconId = 1
    if (props.parent instanceof ObservableLandBasedAirCorps) {
      selectedIconId = 37
    }
    this.state = { selectedIconId, visibleAbysall: false, anchorEl: null, equipment: null }
  }

  public selectIconId = (selectedIconId: number | string) => () => this.setState({ selectedIconId })

  public toggleAbysall = () => this.setState(({ visibleAbysall }) => ({ visibleAbysall: !visibleAbysall }))

  public handleEquipmentCardOpen = (masterEquip: MasterEquipment): React.MouseEventHandler<HTMLElement> => event => {
    const equipment = kcObjectFactory.createEquipment({ masterId: masterEquip.id })
    if (equipment) {
      this.setState({ anchorEl: event.currentTarget, equipment })
    }
  }

  public handleEquipmentCardClose = () => {
    this.setState({ anchorEl: null, equipment: null })
  }

  public handleEquipmentClick = (equip: MasterEquipment) => () => {
    const { id: masterId, category } = equip
    const { createEquipment } = this.props
    if (!createEquipment) {
      return
    }
    let proficiency = 0
    if (category.isAerialCombatAircraft) {
      proficiency = 100
    }
    if (category.isReconnaissanceAircraft) {
      proficiency = 120
    }
    if (masterId > 500 || category.is('LandBasedReconnaissanceAircraft')) {
      proficiency = 0
    }
    createEquipment({ masterId, proficiency })
  }

  public render() {
    const { selectedIconId, visibleAbysall, anchorEl, equipment } = this.state
    const { classes, parent } = this.props

    const visibleType = buttonTypes.find(({ iconId }) => iconId === selectedIconId)
    let visibleEquipments = masterEquipments.filter(equip => {
      const isAbyssal = equip.id > 500
      const { categoryId } = equip
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
        return isAbyssal
      } else {
        return !isAbyssal
      }
    })

    let iconIds = buttonTypes.map(({ iconId }) => iconId)
    if (parent instanceof ObservableLandBasedAirCorps) {
      iconIds = [6, 7, 8, 9, 10, 37]
      visibleEquipments = visibleEquipments.filter(equip => equip.category.isAerialCombatAircraft)
    } else if (parent) {
      iconIds = iconIds.filter(iconId => iconId !== 37)
    }

    return (
      <Paper>
        <div>
          {iconIds.map(iconId => (
            <Button key={iconId} onClick={this.selectIconId(iconId)}>
              <EquipmentIcon iconId={iconId} />
            </Button>
          ))}
          <Button onClick={this.selectIconId('other')}>他</Button>
          <FormControlLabel label="深海装備" control={<Checkbox onClick={this.toggleAbysall} />} />
        </div>

        {/*装備一覧*/}
        <div className={classes.equipmentButtons}>
          {visibleEquipments.map((equip, index) => (
            <Button
              className={classes.equipmentButton}
              key={index}
              onClick={this.handleEquipmentClick(equip)}
              onMouseEnter={this.handleEquipmentCardOpen(equip)}
              onMouseLeave={this.handleEquipmentCardClose}
            >
              <EquipmentIcon iconId={equip.iconId} />
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
              <Paper>
                {equipment && <EquipmentCard style={{ background: 'rgba(0, 0, 0, 0.9)' }} equipment={equipment} />}
              </Paper>
            </Fade>
          )}
        </Popper>
      </Paper>
    )
  }
}

interface IParams {
  type?: 'ship' | 'landBase'
  parentId?: string
  index?: string
}

const mapStateToProps = (s: never, props: RouteComponentProps<IParams>) => {
  const { type, parentId, index } = props.match.params
  if (!type || !parentId || !index) {
    return
  }

  const { getShip, getLandBasedAirCorps } = stores.operationStore
  const parent = type === 'ship' ? getShip(parentId) : getLandBasedAirCorps(parentId)
  if (!parent) {
    return
  }

  return {
    parent,
    createEquipment(data: IEquipmentDataObject) {
      parent.createEquipment(Number(index), data)
      props.history.replace('/operation')
    }
  }
}

const injected = inject(mapStateToProps)(EquipmentsPage)

export default withStyles(styles)(injected)
