import { AirControlState, BattleType, nonNullable, Side, IOperation, Formation } from 'kc-calculator'
import { Dictionary } from 'lodash'
import { countBy, groupBy, mapValues, times as lodashTimes } from 'lodash-es'
import React from 'react'

import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TextField from '@material-ui/core/TextField'

import { CarrierBasedAerialCombat, LandBaseAerialSupport } from 'kc-calculator/dist/Battle/AerialCombat'
import BattleFleet from 'kc-calculator/dist/Battle/BattleFleet'
import CombatInformation from 'kc-calculator/dist/Battle/CombatInformation'

import { ObservableOperation } from '../stores'
import { LandBasedAirCorpsMode } from '../stores/ObservableLandBasedAirCorps'
import kcObjectFactory from '../stores/kcObjectFactory'
import { toPercent } from '../utils'

export const operationToBattleFleet = (operation: ObservableOperation, isEnemy?: boolean) => {
  const { side, fleetType, mainFleet, escortFleet, landBase } = kcObjectFactory.createOperation(operation)
  const battleFleet = new BattleFleet(isEnemy ? Side.Enemy : side, fleetType, landBase, mainFleet, escortFleet)
  if (operation.temporaryFormation) {
    battleFleet.formation = operation.temporaryFormation
  }
  return battleFleet
}

type AerialBattleResult = Array<{
  name: string
  airStateName: string
  fighterPower: number
}>

interface AerialCombatSimulatorProps {
  operation: ObservableOperation
}

interface AerialCombatSimulatorState {
  times: number
  simulationResult: Array<{ name: string; count: Dictionary<string>; fighterPower: number }> | null
}

class AerialCombatSimulator extends React.Component<AerialCombatSimulatorProps, AerialCombatSimulatorState> {
  public state: AerialCombatSimulatorState = { simulationResult: null, times: 1000 }

  public handleTimesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ times: Number(event.currentTarget.value) })
  }

  public aerialBattle = () => {
    const observableOperation = this.props.operation
    const enemyOperation = observableOperation.enemy
    const playerFleet = operationToBattleFleet(observableOperation)
    if (!enemyOperation) {
      return
    }
    const enemyFleet = operationToBattleFleet(enemyOperation, true)

    const combatInfo = new CombatInformation(playerFleet, enemyFleet, BattleType.NormalBattle)

    const results: AerialBattleResult = []

    playerFleet.landBase.forEach((airCorps, index) => {
      const { mode } = observableOperation.landBase[index]
      const hasPlane = airCorps.planes.length > 0
      if (mode === LandBasedAirCorpsMode.Standby || !hasPlane) {
        return
      }

      const initialSlots = airCorps.slots.concat()
      const result1 = {
        name: index + 1 + '-1',
        airStateName: new LandBaseAerialSupport(combatInfo, airCorps).main().airControlState.name,
        fighterPower: combatInfo.enemy.mainFleet.fighterPower
      }

      results.push(result1)

      if (mode === LandBasedAirCorpsMode.Sortie2) {
        airCorps.slots.forEach((_, slotIndex) => {
          airCorps.slots[slotIndex] = initialSlots[slotIndex]
        })
        const result2 = {
          name: index + 1 + '-2',
          airStateName: new LandBaseAerialSupport(combatInfo, airCorps).main().airControlState.name,
          fighterPower: combatInfo.enemy.mainFleet.fighterPower
        }
        results.push(result2)
      }
    })

    if (combatInfo.player.allShips.length > 0) {
      const resultMain = {
        name: 'main',
        airStateName: new CarrierBasedAerialCombat(combatInfo).main().airControlState.name,
        fighterPower: combatInfo.enemy.mainFleet.fighterPower
      }
      results.push(resultMain)
    }

    return results
  }

  public simulate = () => {
    const { times } = this.state
    const battleResults = lodashTimes(times, this.aerialBattle)
      .filter(nonNullable)
      .flat()
    const mapper = ([name, battleResult]: [string, typeof battleResults]) => {
      const count = mapValues(countBy(battleResult, result => result.airStateName), result => toPercent(result / times))
      const fighterPower95 = battleResult.map(({ fighterPower }) => fighterPower).sort((fp1, fp2) => fp2 - fp1)[
        Math.floor(times * 0.05)
      ]
      return { name, count, fighterPower: fighterPower95 }
    }
    const simulationResult = Object.entries(groupBy(battleResults, 'name')).map(mapper)

    this.setState({ simulationResult })
  }

  public render() {
    const { operation } = this.props
    if (!operation.enemy) {
      return null
    }

    const { simulationResult } = this.state

    return (
      <div style={{ margin: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            label="試行回数"
            type="number"
            value={this.state.times}
            inputProps={{ min: 1 }}
            onChange={this.handleTimesChange}
          />
          <Button onClick={this.simulate}>シミュレート</Button>
        </div>
        {simulationResult && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>フェーズ</TableCell>
                <TableCell align="right">制空権喪失</TableCell>
                <TableCell align="right">航空劣勢</TableCell>
                <TableCell align="right">制空均衡</TableCell>
                <TableCell align="right">航空優勢</TableCell>
                <TableCell align="right">制空権確保</TableCell>
                <TableCell align="right">航空戦後敵制空値(上位95%)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {simulationResult.map(
                ({ name, count: { 制空権喪失, 航空劣勢, 制空均衡, 航空優勢, 制空権確保 }, fighterPower }) => (
                  <TableRow key={name}>
                    <TableCell component="th" scope="row">
                      {name}
                    </TableCell>
                    <TableCell align="right">{制空権喪失}</TableCell>
                    <TableCell align="right">{航空劣勢}</TableCell>
                    <TableCell align="right">{制空均衡}</TableCell>
                    <TableCell align="right">{航空優勢}</TableCell>
                    <TableCell align="right">{制空権確保}</TableCell>
                    <TableCell align="right">{fighterPower}</TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        )}
      </div>
    )
  }
}

export default AerialCombatSimulator
