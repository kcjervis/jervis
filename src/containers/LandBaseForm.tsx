import { nonNullable } from 'kc-calculator'
import flatMap from 'lodash/flatMap'
import React from 'react'

import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import AerialCombatSimulator from './AerialCombatSimulator'
import LandBasedAirCorpsCard from './LandBasedAirCorpsCard'

import { observer } from 'mobx-react'
import EnemyFleet from '../components/EnemyFleet'
import ProficiencyDialog from '../components/ProficiencyDialog'
import { ObservableOperation } from '../stores'

interface LandBaseForm {
  operation: ObservableOperation
}

const LandBaseForm: React.FC<LandBaseForm> = ({ operation }) => {
  const removeEnemy = () => {
    operation.enemies = []
  }
  const handleProficiencyChange = (inter: number) => {
    const equipments = flatMap(operation.landBase, airCorps => airCorps.equipments.filter(nonNullable))
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
        {operation.enemies.map((enemy, index) => (
          <EnemyFleet key={index} enemy={enemy} />
        ))}
        {operation.enemies.length === 0 ? (
          <Button href={`#/maps/${operation.id}`}>敵編成を選択</Button>
        ) : (
          <Button onClick={removeEnemy}>敵編成を削除</Button>
        )}
        <AerialCombatSimulator operation={operation} />
      </Paper>
    </>
  )
}

export default observer(LandBaseForm)
