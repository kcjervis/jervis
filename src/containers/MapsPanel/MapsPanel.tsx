import React, { useMemo } from 'react'
import maps from '../../data/maps'
import { nonNullable } from 'kc-calculator'

import Box from '@material-ui/core/Box'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

import { createEnemyBattleFleet } from './enemyBattleFleet'
import EnemyFleetCard from './EnemyFleetCard'
import { useSelect } from '../../hooks'
import { Select, SelectButtons } from '../../components'
import { ObservableOperation } from '../../stores'

const useStyles = makeStyles(
  createStyles({
    select: {
      minWidth: 8 * 10,
      textAlign: 'center'
    },
    img: {
      display: 'block',
      maxWidth: 8 * 50
    }
  })
)

const worlds = [
  { id: 1, name: '鎮守府海域' },
  { id: 2, name: '南西諸島海域' },
  { id: 3, name: '北方海域' },
  { id: 7, name: '南西海域' },
  { id: 4, name: '西方海域' },
  { id: 5, name: '南方海域' },
  { id: 6, name: '中部海域' },
  { id: 43, name: '邀撃！ブイン防衛作戦' },
  { id: 44, name: '発動！友軍救援「第二次ハワイ作戦」' }
]

const mapToLabel = ({ mapId }: { mapId: number }) => `${Math.floor(mapId / 10)} - ${mapId % 10}`
const getCellLabel = (cell: { point: string }) => cell.point
const getDifficultyLabel = (difficulty: number) => ['丁', '丙', '乙', '甲'][difficulty - 1]

type MapsPanelProps = {
  onSelect?: (operation: ObservableOperation) => void
}

const MapsPanel: React.FC<MapsPanelProps> = ({ onSelect }) => {
  const classes = useStyles()

  const worldSelect = useSelect(worlds, worlds[6])
  const worldMaps = maps.filter(({ mapId }) => Math.floor(mapId / 10) === worldSelect.value.id)
  const mapSelect = useSelect(worldMaps)

  const cellOptions = mapSelect.value.cells.filter(cell => cell.enemies && cell.enemies.length > 0)
  const cellSelect = useSelect(cellOptions)
  const difficultySelect = useSelect([4, 3, 2, 1])

  const isEvent = mapSelect.value.mapId > 100

  const { mapId } = mapSelect.value
  const { point } = cellSelect.value
  const pointName = `${mapId} ${point} ${isEvent ? getDifficultyLabel(difficultySelect.value) : ''}`

  const enemyBattleFleets = useMemo(() => {
    let { enemies } = cellSelect.value
    if (!enemies) {
      return []
    }
    if (isEvent) {
      enemies = enemies.filter(enemy => enemy.difficulty === difficultySelect.value)
    }
    return enemies.map(createEnemyBattleFleet).filter(nonNullable)
  }, [cellSelect.value, difficultySelect.value])

  let mapImageSrc: string | undefined
  try {
    mapImageSrc = require(`../../images/maps/${mapSelect.value.mapId}.png`)
  } catch {
    console.warn(`map ${mapSelect.value.mapId} is not found`)
  }

  return (
    <Box m={1}>
      <div>
        <Select {...worldSelect} />
        <Select className={classes.select} {...mapSelect} getOptionLabel={mapToLabel} />
        {isEvent && <Select className={classes.select} {...difficultySelect} getOptionLabel={getDifficultyLabel} />}
      </div>
      <img className={classes.img} src={mapImageSrc} />
      <SelectButtons {...cellSelect} getOptionLabel={getCellLabel} buttonProps={{ size: 'large' }} />

      {enemyBattleFleets.map((battleFleet, index) => (
        <EnemyFleetCard key={index} fleet={battleFleet} onSelect={onSelect} name={pointName} />
      ))}
    </Box>
  )
}

export default MapsPanel
