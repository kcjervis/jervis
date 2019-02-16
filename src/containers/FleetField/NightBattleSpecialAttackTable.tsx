import { IFleet, IShip, NightBattleSpecialAttack } from 'kc-calculator'
import { observable } from 'mobx'
import { observer } from 'mobx-react-lite'
import React, { createContext, useContext } from 'react'

import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'

import { toPercent } from './ContactTable'

class NightBattleStore {
  @observable
  public playerSearchlight = false

  @observable
  public playerStarshell = false

  public togglePlayerSearchlight = () => {
    this.playerSearchlight = !this.playerSearchlight
  }

  public togglePlayerStarshell = () => {
    this.playerStarshell = !this.playerStarshell
  }
}

const NightBattleStoreContext = createContext(new NightBattleStore())

interface IShipRowProps {
  ship: IShip
  isFlagship: boolean
}

const ShipRow: React.FC<IShipRowProps> = ({ ship, isFlagship }) => {
  const { playerSearchlight, playerStarshell } = useContext(NightBattleStoreContext)
  const preModifierValue = NightBattleSpecialAttack.calcPreModifierValue(ship)
  const baseValue = NightBattleSpecialAttack.calcBaseValue(ship, isFlagship, {
    playerSearchlight,
    enemySearchlight: false,
    playerStarshell,
    enemyStarshell: false
  })

  const cis = NightBattleSpecialAttack.getPossibleSpecialAttacks(ship)
  const cutinRates = new Array<{ ci: NightBattleSpecialAttack; rate: number }>()
  const totalRate = cis.reduce((acc, curCutin) => {
    let currentRate = (1 - acc) * curCutin.calcRate(baseValue)
    if (currentRate > 1) {
      currentRate = 1
    }
    cutinRates.push({ ci: curCutin, rate: currentRate })
    return acc + currentRate
  }, 0)

  return (
    <TableRow>
      <TableCell component="th" scope="row">
        {ship.name}
      </TableCell>
      <TableCell align="right">{preModifierValue}</TableCell>
      <TableCell align="right">{baseValue}</TableCell>
      <TableCell align="right">{toPercent(totalRate)}</TableCell>
      <TableCell>{cutinRates.map(({ ci, rate }) => `${ci.name} ${toPercent(rate)} `)}</TableCell>
    </TableRow>
  )
}

interface INightBattleSpecialAttackTable {
  fleet: IFleet
}

const NightBattleSpecialAttackTable: React.FC<INightBattleSpecialAttackTable> = props => {
  const { fleet } = props
  const nightBattleStore = useContext(NightBattleStoreContext)
  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            onClick={nightBattleStore.togglePlayerSearchlight}
            checked={nightBattleStore.playerSearchlight}
            color="primary"
          />
        }
        label="探照灯"
      />
      <FormControlLabel
        control={
          <Checkbox
            onClick={nightBattleStore.togglePlayerStarshell}
            checked={nightBattleStore.playerStarshell}
            color="primary"
          />
        }
        label="照明弾"
      />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>艦娘</TableCell>
            <TableCell align="right">補正無しCI項</TableCell>
            <TableCell align="right">CI項</TableCell>
            <TableCell align="right">合計発動率</TableCell>
            <TableCell>発動率</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fleet.ships.map((ship, index) => ship && <ShipRow key={index} ship={ship} isFlagship={index === 0} />)}
        </TableBody>
      </Table>
    </>
  )
}

export default observer(NightBattleSpecialAttackTable)
