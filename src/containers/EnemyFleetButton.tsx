import React from 'react'
import useReactRouter from 'use-react-router'

import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'

import EnemyFleet, { EnemyFleetProps } from '../components/EnemyFleet'
import { useOperationStore } from '../hooks'

type EnemyFleetButtonProps = { operationId?: string } & EnemyFleetProps

const EnemyFleetButton: React.FC<EnemyFleetButtonProps> = ({ enemy, operationId }) => {
  const { getOperation } = useOperationStore()
  const { history } = useReactRouter()
  const handleClikc = () => {
    if (!operationId) {
      return
    }
    const operation = getOperation(operationId)
    if (operation) {
      operation.enemies.push(enemy)
      history.replace('/operation')
    }
  }
  return (
    <>
      <Divider />
      <Button onClick={handleClikc} variant="outlined">
        <EnemyFleet enemy={enemy} />
      </Button>
    </>
  )
}

export default EnemyFleetButton
