import React, { useMemo } from 'react'
import useReactRouter from 'use-react-router'

import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'

import EnemyFleet from '../components/EnemyFleet'
import { useOperationStore } from '../hooks'
import { TEnemyFleet } from '*maps'
import { ObservableOperation } from '../stores'
import { Side, FleetTypeName, Formation, BattleFleet } from 'kc-calculator'
import kcObjectFactory, { masterData } from '../stores/kcObjectFactory'

const masterIdToDataObject = (masterId: number) => {
  const master = masterData.findMasterShip(masterId)
  if (!master) {
    return undefined
  }
  return {
    masterId: master.id,
    level: 1,
    slots: master.slotCapacities.concat(),
    equipments: master.equipment.map(gear => {
      if (gear === undefined) {
        return undefined
      }
      if (typeof gear === 'number') {
        return { masterId: gear }
      }
      return { masterId: gear.id, improvement: gear.improvement }
    })
  }
}

const masterIdsToFleet = (ids: number[]) => {
  if (ids.length === 0) {
    return undefined
  }
  return kcObjectFactory.createFleet({ ships: ids.map(masterIdToDataObject) })
}

const stringToFormation = (value: string, isCombinedFleet?: boolean) => {
  const formation = Formation.values.find(({ name }) => name === value)
  const defaultFormation = isCombinedFleet ? Formation.CruisingFormation4 : Formation.LineAhead
  return formation || defaultFormation
}

const createEnemyBattleFleet = (enemy: TEnemyFleet) => {
  const { ships, formation: formationName } = enemy
  const mainFleet = masterIdsToFleet(ships.slice(0, 6))
  if (!mainFleet) {
    return undefined
  }
  const escortFleet = masterIdsToFleet(ships.slice(6, 12))
  const isCombinedFleet = ships.length > 6
  const fleetType = isCombinedFleet ? FleetTypeName.Combined : FleetTypeName.Single

  const battleFleet = new BattleFleet(Side.Enemy, fleetType, [], mainFleet, escortFleet)
  battleFleet.formation = stringToFormation(formationName, isCombinedFleet)

  return battleFleet
}

export const enemyFleetToOperation = (enemyFleet: TEnemyFleet) => {
  const { ships, formation: formationName } = enemyFleet
  const side = Side.Enemy
  const isCombinedFleet = ships.length > 6
  const fleetType = isCombinedFleet ? FleetTypeName.Combined : FleetTypeName.Single

  const mainFleet = { ships: ships.slice(0, 6).map(masterIdToDataObject) }
  const escortFleet = { ships: ships.slice(6, 12).map(masterIdToDataObject) }

  const operation = ObservableOperation.create({
    name,
    side,
    fleetType,
    fleets: [mainFleet, escortFleet],
    landBase: []
  })

  operation.setFormation(stringToFormation(formationName, isCombinedFleet))

  return operation
}

type EnemyFleetButtonProps = { enemy: TEnemyFleet; operationId?: string }

const EnemyFleetButton: React.FC<EnemyFleetButtonProps> = ({ enemy, operationId }) => {
  const { getOperation } = useOperationStore()
  const { history } = useReactRouter()
  const handleClikc = () => {
    if (!operationId) {
      return
    }
    const operation = getOperation(operationId)
    if (operation) {
      operation.enemy = enemyFleetToOperation(enemy)
      history.replace('/operation')
    }
  }

  const battleFleet = createEnemyBattleFleet(enemy)
  if (!battleFleet) {
    return null
  }

  return (
    <>
      <Divider />
      <Button onClick={handleClikc}>
        <EnemyFleet battleFleet={battleFleet} difficulty={enemy.difficulty} />
      </Button>
    </>
  )
}

export default EnemyFleetButton
