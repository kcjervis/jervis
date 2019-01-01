import { AirControlState, BattleType, nonNullable, Side } from 'kc-calculator'
import { Dictionary } from 'lodash'
import countBy from 'lodash/countBy'
import flatMap from 'lodash/flatMap'
import groupBy from 'lodash/groupBy'
import React from 'react'

import Button from '@material-ui/core/Button'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'

import { CarrierBasedAerialCombat, LandBaseAerialSupport } from 'kc-calculator/dist/combats/AerialCombat'
import BattleFleet from 'kc-calculator/dist/combats/BattleFleet'
import CombatInformation from 'kc-calculator/dist/combats/CombatInformation'

import { createEnemyBattleFleet } from '../components/EnemyFleet'
import { ObservableOperation } from '../stores'
import { LandBasedAirCorpsMode } from '../stores/ObservableLandBasedAirCorps'

type AerialBattleResult = Array<{
  name: string
  airControlState: '制空権確保' | '航空優勢' | '制空均衡' | '航空劣勢' | '制空権喪失'
  fighterPower: number
}>

interface IAerialCombatSimulatorProps {
  operation: ObservableOperation
}

interface IAerialCombatSimulatorState {
  simulationResult: Array<{ name: string; count: Dictionary<number> }> | null
}

class AerialCombatSimulator extends React.Component<IAerialCombatSimulatorProps, IAerialCombatSimulatorState> {
  public state: IAerialCombatSimulatorState = { simulationResult: null }

  public aerialBattle = () => {
    const { operation } = this.props
    const { side, fleetType, mainFleet, escortFleet, landBase } = operation.asKcObject
    const playerFleet = new BattleFleet(side, fleetType, landBase, mainFleet, escortFleet)
    const enemyFleet = createEnemyBattleFleet(operation.enemies[0])
    if (!enemyFleet) {
      return
    }
    const combatInfo = new CombatInformation(playerFleet, enemyFleet, BattleType.NormalBattle)

    const results: AerialBattleResult = []

    operation.landBase.forEach((airCorps, index) => {
      const { mode } = airCorps
      const kcAirCorps = airCorps.asKcObject
      const hasPlane = kcAirCorps.planes.length > 0
      if (mode === LandBasedAirCorpsMode.Standby || !hasPlane) {
        return
      }

      const initialSlots = kcAirCorps.slots.concat()
      const result1 = {
        name: index + 1 + '-1',
        airControlState: new LandBaseAerialSupport(combatInfo, kcAirCorps).main().airControlState.name,
        fighterPower: combatInfo.enemy.mainFleet.fighterPower
      }
      results.push(result1)

      if (mode === LandBasedAirCorpsMode.Sortie2) {
        kcAirCorps.slots.forEach((_, slotIndex) => {
          kcAirCorps.slots[slotIndex] = initialSlots[slotIndex]
        })
        const result2 = {
          name: index + 1 + '-2',
          airControlState: new LandBaseAerialSupport(combatInfo, kcAirCorps).main().airControlState.name,
          fighterPower: combatInfo.enemy.mainFleet.fighterPower
        }
        results.push(result2)
      }
    })
    const resultMain = {
      name: 'main',
      airControlState: new CarrierBasedAerialCombat(combatInfo).main().airControlState.name,
      fighterPower: combatInfo.enemy.mainFleet.fighterPower
    }
    results.push(resultMain)
    return results
  }

  public simulate = () => {
    const battleResults = flatMap(Array.from(Array(1000), this.aerialBattle).filter(nonNullable))
    const simulationResult = Object.entries(groupBy(battleResults, 'name')).map(([name, battleResult]) => ({
      name,
      count: countBy(battleResult, result => result.airControlState)
    }))
    this.setState({ simulationResult })
  }

  public render() {
    const { operation } = this.props
    if (operation.enemies.length === 0) {
      return null
    }

    const { simulationResult } = this.state

    return (
      <div>
        <Button onClick={this.simulate}>シミュレート</Button>
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
              </TableRow>
            </TableHead>
            <TableBody>
              {simulationResult.map(({ name, count }) => (
                <TableRow key={name}>
                  <TableCell component="th" scope="row">
                    {name}
                  </TableCell>
                  <TableCell align="right">{count.制空権喪失}</TableCell>
                  <TableCell align="right">{count.航空劣勢}</TableCell>
                  <TableCell align="right">{count.制空均衡}</TableCell>
                  <TableCell align="right">{count.航空優勢}</TableCell>
                  <TableCell align="right">{count.制空権確保}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    )
  }
}

export default AerialCombatSimulator
