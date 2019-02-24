import React from 'react'
import { RouteComponentProps } from 'react-router'

import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import Typography from '@material-ui/core/Typography'

import { TEnemyFleet, TEventDifficulty } from 'maps'
import EnemyFleet from '../components/EnemyFleet'
import maps from '../data/maps'
import stores from '../stores'

const worlds = [
  { id: 1, name: '鎮守府海域' },
  { id: 2, name: '南西諸島海域' },
  { id: 3, name: '北方海域' },
  { id: 7, name: '南西海域' },
  { id: 4, name: '西方海域' },
  { id: 5, name: '南方海域' },
  { id: 6, name: '中部海域' },
  { id: 43, name: '邀撃！ブイン防衛作戦' }
]

interface IMapsPageState {
  worldId: number
  mapId: number
  point: string
  difficulty: number
}

/**
 * 海域ページ
 */
class MapsPage extends React.Component<RouteComponentProps<{ operationId?: string }>, IMapsPageState> {
  public readonly difficulties: TEventDifficulty[] = [1, 2, 3, 4]

  public state: IMapsPageState = { worldId: 6, mapId: 0, point: 'A', difficulty: 4 }

  public handleChangeWorld = (event: React.ChangeEvent<{}>, worldId: number) => {
    this.setState({ worldId, mapId: 0 })
  }

  public handleChangeDifficulty = (event: React.ChangeEvent<{}>, difficulty: number) => {
    this.setState({ difficulty })
  }

  public setMapId = (mapId: number) => () => {
    this.setState({ mapId })
  }

  public setPoint = (point: string) => () => {
    this.setState({ point })
  }

  public handleEnemyClick = (enemy: TEnemyFleet) => () => {
    const { operationId } = this.props.match.params
    if (!operationId) {
      return
    }
    const operation = stores.operationStore.getOperation(operationId)
    if (operation) {
      operation.enemies.push(enemy)
      this.props.history.replace('/operation')
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
          <Tabs value={this.state.worldId} onChange={this.handleChangeWorld}>
            {worlds.map(({ id: worldId, name }) => (
              <Tab key={worldId} value={worldId} label={name} />
            ))}
          </Tabs>

          {!selectedMap &&
            maps
              .filter(({ mapId }) => Math.floor(mapId / 10) === this.state.worldId)
              .map(({ mapId }) => (
                <Button key={mapId} onClick={this.setMapId(mapId)} size="large">
                  {mapId}
                  <img style={{ width: 312 }} src={this.getMapImage(mapId)} />
                </Button>
              ))}
        </div>

        <div>
          {selectedMap && (
            <div>
              {selectedMap.mapId > 100 && (
                <Tabs value={this.state.difficulty} onChange={this.handleChangeDifficulty}>
                  <Tab value={4} label="甲" />
                  <Tab value={3} label="乙" />
                  <Tab value={2} label="丙" />
                  <Tab value={1} label="丁" />
                </Tabs>
              )}
              <div>
                <img src={this.getMapImage(this.state.mapId)} />
              </div>

              {selectedMap.cells
                .filter(cell => cell.enemies && cell.enemies.length > 0)
                .map(cell => (
                  <Button key={cell.point} onClick={this.setPoint(cell.point)} variant="outlined">
                    {cell.point}
                  </Button>
                ))}
            </div>
          )}
        </div>

        {selectedCell &&
          selectedCell.enemies &&
          selectedCell.enemies
            .filter(({ difficulty }) => difficulty === undefined || difficulty === this.state.difficulty)
            .map((enemy, index) => (
              <div key={index}>
                <Divider />
                <Button onClick={this.handleEnemyClick(enemy)} variant="outlined">
                  <EnemyFleet enemy={enemy} />
                </Button>
              </div>
            ))}
      </div>
    )
  }
}

export default MapsPage
