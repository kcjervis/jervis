import React from 'react'
import { BattleFleet } from 'kc-calculator'

import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import { makeStyles, createStyles } from '@material-ui/styles'

import { EnemyFleet, SaveButton } from '../../components'
import { battleFleetToOperation } from './enemyBattleFleet'
import { useOperationStore } from '../../hooks'
import { ObservableOperation } from '../../stores'

type EnemyFleetCardProps = {
  fleet: BattleFleet
  onSelect?: (operation: ObservableOperation) => void
}

const EnemyFleetCard: React.FC<EnemyFleetCardProps> = ({ fleet, onSelect }) => {
  const { persistentOperationStore } = useOperationStore()
  const handleClick = () => {
    const operation = battleFleetToOperation(fleet)
    persistentOperationStore.push(operation)
  }
  const handleSelect = () => {
    const operation = battleFleetToOperation(fleet)
    onSelect && onSelect(operation)
  }

  return (
    <Paper style={{ margin: 16 }}>
      {onSelect && <Button onClick={handleSelect}>編成を選択</Button>}
      <SaveButton title="編成を保存" size="small" onClick={handleClick} />
      <EnemyFleet battleFleet={fleet} />
    </Paper>
  )
}

export default EnemyFleetCard
