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
import kcObjectFactory from '../stores/kcObjectFactory'
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
  simulationResult: Array<{ name: string; count: Dictionary<number>; fighterPower: number }> | null
}

class AerialCombatSimulator extends React.Component<IAerialCombatSimulatorProps, IAerialCombatSimulatorState> {
  public state: IAerialCombatSimulatorState = { simulationResult: null }

  public aerialBattle = () => {
    const observableOperation = this.props.operation
    const { side, fleetType, mainFleet, escortFleet, landBase } = kcObjectFactory.createOperation(observableOperation)
    const playerFleet = new BattleFleet(side, fleetType, landBase, mainFleet, escortFleet)
    const enemyFleet = createEnemyBattleFleet(observableOperation.enemies[0])
    if (!enemyFleet) {
      return
    }
    const combatInfo = new CombatInformation(playerFleet, enemyFleet, BattleType.NormalBattle)

    const results: AerialBattleResult = []

    landBase.forEach((airCorps, index) => {
      const { mode } = observableOperation.landBase[index]
      const hasPlane = airCorps.planes.length > 0
      if (mode === LandBasedAirCorpsMode.Standby || !hasPlane) {
        return
      }

      const initialSlots = airCorps.slots.concat()
      const result1 = {
        name: index + 1 + '-1',
        airControlState: new LandBaseAerialSupport(combatInfo, airCorps).main().airControlState.name,
        fighterPower: combatInfo.enemy.mainFleet.fighterPower
      }

      results.push(result1)

      if (mode === LandBasedAirCorpsMode.Sortie2) {
        airCorps.slots.forEach((_, slotIndex) => {
          airCorps.slots[slotIndex] = initialSlots[slotIndex]
        })
        const result2 = {
          name: index + 1 + '-2',
          airControlState: new LandBaseAerialSupport(combatInfo, airCorps).main().airControlState.name,
          fighterPower: combatInfo.enemy.mainFleet.fighterPower
        }
        results.push(result2)
      }
    })

    if (combatInfo.player.allShips.length > 0) {
      const resultMain = {
        name: 'main',
        airControlState: new CarrierBasedAerialCombat(combatInfo).main().airControlState.name,
        fighterPower: combatInfo.enemy.mainFleet.fighterPower
      }
      results.push(resultMain)
    }

    return results
  }

  public simulate = () => {
    const battleResults = flatMap(Array.from(Array(1000), this.aerialBattle).filter(nonNullable))
    const simulationResult = Object.entries(groupBy(battleResults, 'name')).map(([name, battleResult]) => ({
      name,
      count: countBy(battleResult, result => result.airControlState),
      fighterPower: battleResult.map(({ fighterPower }) => fighterPower).sort((fp1, fp2) => fp2 - fp1)[50]
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
                <TableCell align="right">制空権喪失 (%)</TableCell>
                <TableCell align="right">航空劣勢 (%)</TableCell>
                <TableCell align="right">制空均衡 (%)</TableCell>
                <TableCell align="right">航空優勢 (%)</TableCell>
                <TableCell align="right">制空権確保 (%)</TableCell>
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
                    <TableCell align="right">{制空権喪失 && 制空権喪失 / 10}</TableCell>
                    <TableCell align="right">{航空劣勢 && 航空劣勢 / 10}</TableCell>
                    <TableCell align="right">{制空均衡 && 制空均衡 / 10}</TableCell>
                    <TableCell align="right">{航空優勢 && 航空優勢 / 10}</TableCell>
                    <TableCell align="right">{制空権確保 && 制空権確保 / 10}</TableCell>
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
