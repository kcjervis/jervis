import React from 'react'
import { Link } from 'react-router-dom'

import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'

import AerialCombatSimulator from './AerialCombatSimulator'
import LandBasedAirCorpsCard from './LandBasedAirCorpsCard'

import { observer } from 'mobx-react'
import EnemyFleet from '../components/EnemyFleet'
import { ObservableOperation } from '../stores'

interface ILandBaseForm {
  operation: ObservableOperation
}

const LandBaseForm: React.SFC<ILandBaseForm> = ({ operation }) => {
  const removeEnemy = () => {
    operation.enemies = []
  }
  return (
    <div style={{ margin: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {operation.landBase.map((airCorps, index) => (
          <LandBasedAirCorpsCard key={airCorps.id} landBasedAirCorps={airCorps} index={index} />
        ))}
      </div>

      <Paper>
        {operation.enemies.map((enemy, index) => (
          <EnemyFleet key={index} enemy={enemy} />
        ))}
        {operation.enemies.length === 0 ? (
          <Link to={`/maps/${operation.id}`}>
            <Button>敵編成を選択</Button>
          </Link>
        ) : (
          <Button onClick={removeEnemy}>敵編成を削除</Button>
        )}
        <AerialCombatSimulator operation={operation} />
      </Paper>
    </div>
  )
}

export default observer(LandBaseForm)
