import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'

import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'

import ShipModel from '../calculator/Ship'
import MasterData from '../data'
import { actions } from '../redux/modules/orm'

interface IShipsPageProps extends RouteComponentProps<{}> {
  createShip: (payload: { masterId: number; slots: number[]; fleetId: number; index: number }) => void
}

interface IShipsPageState {
  visibleTypes: number[]
  visibleAlly: boolean
  visibleAbysall: boolean
  visibleBasic: boolean
}

/**
 * 艦娘一覧ページ
 */
class ShipsPage extends React.Component<IShipsPageProps, IShipsPageState> {
  public readonly state = {
    /**
     * 表示艦種
     */
    visibleTypes: [8, 9, 10, 12],
    /**
     * 味方表示
     */
    visibleAlly: true,
    /**
     * 深海棲艦表示
     */
    visibleAbysall: false,
    /**
     * 最終改造艦以外も表示
     */
    visibleBasic: false
  }

  /**
   * 艦娘マスターデータにモデルを適応してソートしたもの
   */
  public readonly baseShips = MasterData.allShipIds.map(ShipModel.createShipById).sort((a, b) => a.sortId - b.sortId)

  public readonly categories = [
    { name: '戦艦級', types: [8, 9, 10, 12] },
    { name: '航空母艦', types: [7, 11, 18] },
    { name: '重巡級', types: [5, 6] },
    { name: '軽巡級', types: [3, 4, 20] },
    { name: '駆逐艦', types: [2] },
    { name: '海防艦', types: [1] },
    { name: '潜水艦', types: [13, 14] },
    { name: '補助艦艇', types: [15, 16, 17, 19, 20, 21, 22] }
  ]

  public setTypes = (visibleTypes: number[]) => () => {
    this.setState({ visibleTypes })
  }

  public toggleAbysall = () => {
    this.setState(state => ({ visibleAlly: !state.visibleAlly, visibleAbysall: !state.visibleAbysall }))
  }

  /**
   * 選択した艦娘を新しく作成して艦隊に編入する
   */
  public selectShip = ({ masterId, slots }: { masterId: number; slots: number[] }) => () => {
    const { location, history, createShip } = this.props
    const { fleetId, index } = location.state
    if (typeof fleetId === 'number' && typeof index === 'number') {
      createShip({ masterId, slots, fleetId, index })
      history.go(-1)
    }
  }

  /**
   * 艦型ごとに艦娘を分類した配列を取得
   */
  get visibleShipClasses() {
    const { visibleTypes, visibleAlly, visibleAbysall, visibleBasic } = this.state

    const visibleShips = this.baseShips.filter(ship => {
      if (!visibleTypes.includes(ship.shipTypeId)) {
        return false
      }
      if (visibleAlly && ship.isAbysall) {
        return false
      }
      if (visibleAbysall && !ship.isAbysall) {
        return false
      }
      if (!visibleBasic) {
        if (!ship.remodel.canConvert && ship.remodel.canRemodel) {
          return false
        }
      }

      return true
    })

    const visibleShipClasses = []
    for (const ship of visibleShips) {
      const { classId } = ship
      const shipClass = visibleShipClasses.find(classElement => classElement.classId === classId)
      if (!shipClass) {
        visibleShipClasses.push({ classId, ships: [ship] })
      } else {
        shipClass.ships.push(ship)
      }
    }
    return visibleShipClasses
  }

  public render() {
    return (
      <div>
        {/*深海棲艦表示切り替え*/}
        <Checkbox children="敵" onClick={this.toggleAbysall} />

        {/*表示する艦娘のカテゴリー選択ボタン*/}
        {this.categories.map(category => (
          <Button key={category.name} size="small" children={category.name} onClick={this.setTypes(category.types)} />
        ))}

        {/*艦娘一覧を表示*/}
        {this.visibleShipClasses.map(({ classId, ships }) => (
          <div key={classId}>
            {/*深海棲艦なら艦型名は非表示*/}
            {!this.state.visibleAbysall && <Typography>{MasterData.getShipClassName(classId)}</Typography>}
            {ships.map(ship => (
              <Button key={ship.masterId} onClick={this.selectShip(ship)}>
                <img src={require(`../images/ships/banner/${ship.masterId}.png`)} />
              </Button>
            ))}
            <Divider />
          </div>
        ))}
      </div>
    )
  }
}
export default connect(
  null,
  { createShip: actions.createShip }
)(ShipsPage)
