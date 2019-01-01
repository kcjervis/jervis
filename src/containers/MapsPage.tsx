import React from 'react'
import { RouteComponentProps } from 'react-router'

import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import { TEnemyFleet, TEventDifficulty } from 'maps'
import EnemyFleet from '../components/EnemyFleet'
import maps from '../data/maps'
import stores from '../stores'

interface IMapsPageState {
  mapId: number
  point: string
}

/**
 * 海域ページ
 */
class MapsPage extends React.Component<RouteComponentProps, IMapsPageState> {
  public readonly difficulties: TEventDifficulty[] = [1, 2, 3, 4]

  public state: IMapsPageState = { mapId: 0, point: 'A' }

  public setMapId = (mapId: number) => () => {
    this.setState({ mapId })
  }

  public setPoint = (point: string) => () => {
    this.setState({ point })
  }

  public handleEnemyClick = (enemy: TEnemyFleet) => () => {
    const { ships } = enemy

    const locationState = this.props.location.state
    if (!locationState) {
      return
    }
    const operation = stores.operationStore.getOperation(locationState.operationId)
    if (operation) {
      operation.enemies.push(enemy)
      this.props.history.go(-1)
    }
  }

  public getMapImage = (mapId: number) => {
    try {
      return require(`../images/maps/${mapId}.png`)
    } catch (err) {
      console.log(`${mapId} is not found`)
    }
  }

  public render() {
    const selectedMap = maps.find(map => map.mapId === this.state.mapId)
    const selectedCell = selectedMap && selectedMap.cells.find(cell => cell.point === this.state.point)
    return (
      <div>
        <div>
          {maps.map(({ mapId }) => (
            <Button key={mapId} onClick={this.setMapId(mapId)} size="large">
              {mapId}
              <img src={this.getMapImage(mapId)} />
            </Button>
          ))}
        </div>

        <div>
          {selectedMap &&
            selectedMap.cells.map(cell => (
              <Button onClick={this.setPoint(cell.point)} key={cell.point}>
                {cell.point}
              </Button>
            ))}
        </div>

        {selectedCell &&
          selectedCell.enemies.map((enemy, index) => (
            <Button key={index} onClick={this.handleEnemyClick(enemy)} variant="outlined">
              <EnemyFleet enemy={enemy} />
            </Button>
          ))}
      </div>
    )
  }
}

export default MapsPage
