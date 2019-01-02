import { IShip, IShipDataObject, MasterData, MasterShip, ShipClass, ShipType } from 'kc-calculator'
import React from 'react'
import { RouteComponentProps } from 'react-router'

import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Checkbox from '@material-ui/core/Checkbox'
import Divider from '@material-ui/core/Divider'
import Fade from '@material-ui/core/Fade'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Paper from '@material-ui/core/Paper'
import Popper from '@material-ui/core/Popper'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import MasterShipCard from '../components/MasterShipCard'
import ShipImage from '../components/ShipImage'

import { inject } from 'mobx-react'
import stores, { ShipsPageStore } from '../stores'

const masterData = new MasterData()
const masterShips = masterData.ships

interface IMasterShipsPageProps extends RouteComponentProps {
  createShip?: (ship: IShipDataObject) => void
}

interface IMasterShipsPageState {
  masterShip: MasterShip | null
  anchorEl: HTMLElement | null

  /**
   * 深海味方表示
   */
  visibleAbysall: boolean
  /**
   * 最終改造艦以外も表示するか
   */
  visiblePreRemodel: boolean
  /**
   * 表示艦種
   */
  visibleTypeIds: number[]
}

class MasterShipsPage extends React.Component<IMasterShipsPageProps, IMasterShipsPageState> {
  public readonly categories = [
    { name: '戦艦級', typeIds: [8, 9, 10, 12] },
    { name: '航空母艦', typeIds: [7, 11, 18] },
    { name: '重巡級', typeIds: [5, 6] },
    { name: '軽巡級', typeIds: [3, 4, 20] },
    { name: '駆逐艦', typeIds: [2] },
    { name: '海防艦', typeIds: [1] },
    { name: '潜水艦', typeIds: [13, 14] },
    { name: '補助艦艇', typeIds: [15, 16, 17, 19, 20, 21, 22] }
  ]

  constructor(props: IMasterShipsPageProps) {
    super(props)
    this.state = {
      masterShip: null,
      anchorEl: null,
      visibleAbysall: false,
      visiblePreRemodel: false,
      visibleTypeIds: [7, 11, 18]
    }
  }

  public toggleAbysall = () => {
    this.setState(state => ({ visibleAbysall: !state.visibleAbysall }))
  }

  public setTypeIds = (visibleTypeIds: number[]) => () => {
    this.setState({ visibleTypeIds })
  }

  public handleCardOpen = (masterShip: MasterShip): React.MouseEventHandler<HTMLElement> => event => {
    this.setState({ anchorEl: event.currentTarget, masterShip })
  }

  public handleCardClose = () => {
    this.setState({ anchorEl: null, masterShip: null })
  }

  public selectShip = (ship: MasterShip) => () => {
    const { createShip, history } = this.props
    if (!createShip) {
      return
    }
    const { slotCapacities: slots, id: masterId } = ship
    if (!ship.isAbyssal) {
      createShip({
        masterId,
        level: 99,
        slots,
        equipments: []
      })
    } else {
      const equipments = ship.equipments.map(equip => {
        if (equip === undefined) {
          return undefined
        }
        if (typeof equip === 'number') {
          return { masterId: equip }
        }
        return { masterId: equip.id, improvement: equip.improvement }
      })

      createShip({
        masterId,
        level: 1,
        slots,
        equipments
      })
    }
    history.replace('/operation')
  }

  /**
   * 艦型ごとに艦娘を分類した配列を取得
   */
  public visibleShipClasses() {
    const { visibleTypeIds, visibleAbysall, visiblePreRemodel } = this.state

    const visibleShips = masterShips.filter(ship => {
      if (!visibleTypeIds.includes(ship.shipType.id)) {
        return false
      }
      if (visibleAbysall !== ship.isAbyssal) {
        return false
      }
      if (!visiblePreRemodel) {
        if (!ship.canConvert && ship.canRemodel) {
          return false
        }
      }

      return true
    })

    const visibleShipClassMap = new Map<ShipClass, MasterShip[]>()

    for (const ship of visibleShips) {
      const classedShips = visibleShipClassMap.get(ship.shipClass)
      if (classedShips) {
        classedShips.push(ship)
      } else {
        visibleShipClassMap.set(ship.shipClass, [ship])
      }
    }
    return visibleShipClassMap
  }

  public render() {
    const { anchorEl, masterShip } = this.state
    return (
      <div>
        {/*表示する艦娘のカテゴリー選択ボタン*/}
        {this.categories.map(category => (
          <Button
            key={category.name}
            size="small"
            children={category.name}
            onClick={this.setTypeIds(category.typeIds)}
          />
        ))}

        {/*深海棲艦表示切り替え*/}
        <FormControlLabel label="深海棲艦" control={<Checkbox onClick={this.toggleAbysall} />} />

        {/*艦娘一覧を表示*/}
        {Array.from(this.visibleShipClasses().entries()).map(([shipClass, classedShips]) => (
          <div key={shipClass.id}>
            {/*深海棲艦なら艦型名は非表示*/}
            {!this.state.visibleAbysall && <Typography>{shipClass.name}</Typography>}
            {classedShips.map(ship => (
              <Button
                key={ship.id}
                onClick={this.selectShip(ship)}
                onMouseEnter={this.handleCardOpen(ship)}
                onMouseLeave={this.handleCardClose}
              >
                <ShipImage imageType="banner" masterId={ship.id} />
              </Button>
            ))}
            <Divider />
          </div>
        ))}

        {/*艦娘カードポップアップ*/}
        <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} transition={true}>
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <div>{masterShip && <MasterShipCard ship={masterShip} />}</div>
            </Fade>
          )}
        </Popper>
      </div>
    )
  }
}

interface IParams {
  fleetId?: string
  index?: string
}

const mapStateToProps = (s: any, props: RouteComponentProps<IParams>) => {
  const { fleetId, index } = props.match.params
  if (!fleetId || !index) {
    return
  }
  const fleet = stores.operationStore.getFleet(fleetId)
  if (!fleet) {
    return
  }
  return { createShip: (ship: IShipDataObject) => fleet.createShip(Number(index), ship) }
}

export default inject(mapStateToProps)(MasterShipsPage)
