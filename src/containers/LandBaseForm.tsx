import { nonNullable } from 'kc-calculator'
import React from 'react'
import { observer } from 'mobx-react-lite'

import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Dialog from '@material-ui/core/Dialog'
import Typography from '@material-ui/core/Typography'

import AerialCombatSimulator, { operationToBattleFleet } from './AerialCombatSimulator'
import LandBasedAirCorpsCard from './LandBasedAirCorpsCard'

import EnemyFleet from '../components/EnemyFleet'
import ProficiencyDialog from '../components/ProficiencyDialog'
import { ObservableOperation } from '../stores'
import { useOpen, useOperationStore } from '../hooks'

interface LandBaseForm {
  operation: ObservableOperation
}

const LandBaseForm: React.FC<LandBaseForm> = ({ operation }) => {
  const { onOpen, ...dialogProps } = useOpen()
  const { persistentOperationStore } = useOperationStore()
  const removeEnemy = () => {
    operation.enemy = undefined
  }
  const setEnemy = (enemyOperation: ObservableOperation) => {
    dialogProps.onClose()
    operation.enemy = enemyOperation
  }

  const handleProficiencyChange = (inter: number) => {
    const equipments = operation.landBase.flatMap(airCorps => airCorps.equipments).filter(nonNullable)
    equipments.forEach(equip => {
      if (!equip.asKcObject.category.is('LandBasedReconnaissanceAircraft')) {
        equip.proficiency = inter
      }
    })
  }

  const { mainFleet, escortFleet } = operation.asKcObject
  let combinedFleetFighterPower = mainFleet.fighterPower
  let combinedFleetFighterPowerLabel = ''
  if (escortFleet) {
    combinedFleetFighterPower += escortFleet.fighterPower
    combinedFleetFighterPowerLabel = `連合戦制空: ${combinedFleetFighterPower}`
  }

  return (
    <>
      <Paper style={{ margin: 8, padding: 8 }}>
        <div style={{ display: 'flex' }}>
          <Typography variant="caption" style={{ margin: 8 }}>
            第一艦隊制空: {mainFleet.fighterPower} {combinedFleetFighterPowerLabel}
          </Typography>

          <ProficiencyDialog changeProficiency={handleProficiencyChange} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {operation.landBase.map((airCorps, index) => (
            <LandBasedAirCorpsCard key={airCorps.id} landBasedAirCorps={airCorps} index={index} />
          ))}
        </div>
      </Paper>

      <Paper style={{ margin: 8, padding: 8 }}>
        {operation.enemy ? (
          <>
            <Button onClick={removeEnemy}>敵編成を削除</Button>
            <EnemyFleet battleFleet={operationToBattleFleet(operation.enemy)} />
          </>
        ) : (
          <>
            <Button href={`#/maps/${operation.id}`}>敵編成を選択</Button>
            <Button onClick={onOpen}>編成一覧から選択</Button>
          </>
        )}

        <AerialCombatSimulator operation={operation} />
      </Paper>

      <Dialog {...dialogProps}>
        <div>
          {persistentOperationStore.operations.map(operation => (
            <Button key={operation.id} fullWidth onClick={() => setEnemy(operation)}>
              {operation.name}
            </Button>
          ))}
        </div>
      </Dialog>
    </>
  )
}

export default observer(LandBaseForm)
