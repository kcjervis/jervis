import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { Dispatch } from 'redux'

import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import ShipBanner from '../components/ShipBanner'

import { OperationModel } from '../calculator'
import { actions, selectors } from '../redux/modules/orm'
import { RootState } from '../types'

import { TCellData, TEnemyFleet, TEventDifficulty } from 'maps'
import { ShipModel } from '../calculator'
import MasterData from '../data'

const difficultyToString = (difficulty: TEventDifficulty) => {
  switch (difficulty) {
    case 4:
      return '甲'
    case 3:
      return '乙'
    case 2:
      return '丙'
    case 1:
      return '丁'
  }
}

interface IMapsPageProps extends RouteComponentProps<{}> {
  createEnemyOperation: (payload: { formation: string; ships: ShipModel[]; escortShips?: ShipModel[] }) => void
}

interface IMapsPageState {
  mapId: number
  difficulty: TEventDifficulty
}

/**
 * 海域ページ
 */
class MapsPage extends React.Component<IMapsPageProps, IMapsPageState> {
  public readonly difficulties: TEventDifficulty[] = [1, 2, 3, 4]
  constructor(props: IMapsPageProps) {
    super(props)
    this.state = { mapId: 0, difficulty: 4 }
  }

  public setMapId = (mapId: number) => () => {
    this.setState({ mapId })
  }

  public setDifficulty = (difficulty: TEventDifficulty) => () => {
    this.setState({ difficulty })
  }

  public handleEnemyClick = (enemyFleet: TEnemyFleet) => () => {
    const ships = enemyFleet.ships.map(ShipModel.createShipById)
    const { formation } = enemyFleet
    this.props.createEnemyOperation({ ships, formation })
  }

  public renderFleet = (fleet: TEnemyFleet) => {
    const mainShips = fleet.ships.slice(0, 6)
    const escortShips = fleet.ships.slice(6, 12)
    return (
      <Button onClick={this.handleEnemyClick(fleet)} variant="outlined">
        <div>
          <Typography align="left">{fleet.formation}</Typography>
          <div>
            {mainShips.map((masterId, sIndex) => (
              <ShipBanner key={sIndex} masterId={masterId} />
            ))}
          </div>
          <div>
            {escortShips.map((masterId, sIndex) => (
              <ShipBanner key={sIndex} masterId={masterId} />
            ))}
          </div>
        </div>
      </Button>
    )
  }

  public renderCells = (cell: TCellData) => {
    const { point, enemies } = cell
    const enemyFleets = enemies.filter(enemy => enemy.difficulty === this.state.difficulty)
    if (enemyFleets.length === 0) {
      return null
    }
    return (
      <Paper key={point}>
        <Typography variant="h4" color="secondary">
          {point}
        </Typography>
        {enemyFleets.map(this.renderFleet)}
      </Paper>
    )
  }

  public render() {
    const selectedMap = MasterData.Maps.find(map => map.mapId === this.state.mapId)
    return (
      <div>
        <div>
          {MasterData.Maps.map(({ mapId }) => (
            <Button key={mapId} onClick={this.setMapId(mapId)} size="large">
              {mapId}
            </Button>
          ))}
        </div>

        <div>
          {this.difficulties.map(difficulty => (
            <Button key={difficulty} onClick={this.setDifficulty(difficulty)} size="medium">
              {difficultyToString(difficulty)}
            </Button>
          ))}
        </div>

        {selectedMap && selectedMap.cells.map(this.renderCells)}
      </div>
    )
  }
}

export default connect(
  null,
  { createEnemyOperation: actions.createEnemyOperation }
)(MapsPage)
