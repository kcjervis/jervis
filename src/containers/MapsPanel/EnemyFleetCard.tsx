import React from 'react'
import { BattleFleet } from 'kc-calculator'

import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

import { EnemyFleet, SaveButton, InfoButton } from '../../components'
import { battleFleetToOperation } from './enemyBattleFleet'
import { useOperationStore, useWorkspace } from '../../hooks'
import { ObservableOperation } from '../../stores'

type EnemyFleetCardProps = {
  fleet: BattleFleet
  name: string
  onSelect?: (operation: ObservableOperation) => void
}

const EnemyFleetCard: React.FC<EnemyFleetCardProps> = ({ fleet, name, onSelect }) => {
  const { persistentOperationStore, temporaryOperationStore } = useOperationStore()
  const { openOperation } = useWorkspace()
  const handleOpen = () => {
    const operation = battleFleetToOperation(fleet)
    operation.name = name
    temporaryOperationStore.push(operation)
    openOperation(operation)
  }
  const handleClick = () => {
    const operation = battleFleetToOperation(fleet)
    operation.name = name
    persistentOperationStore.push(operation)
  }
  const handleSelect = () => {
    const operation = battleFleetToOperation(fleet)
    operation.name = name
    onSelect && onSelect(operation)
  }

  return (
    <Paper style={{ margin: 16 }}>
      {onSelect && <Button onClick={handleSelect}>編成を選択</Button>}
      <InfoButton title="開く" size="small" onClick={handleOpen} />
      <SaveButton title="編成を保存" size="small" onClick={handleClick} />
      <EnemyFleet battleFleet={fleet} />
    </Paper>
  )
}

export default EnemyFleetCard
