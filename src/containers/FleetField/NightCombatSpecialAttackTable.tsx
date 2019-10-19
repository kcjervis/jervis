import { Formation, IFleet, IShip, Side, NightCombatSpecialAttack, nonNullable } from "kc-calculator"
import { observable } from "mobx"
import { observer } from "mobx-react-lite"
import React, { createContext, useContext } from "react"

import Checkbox from "@material-ui/core/Checkbox"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Typography from "@material-ui/core/Typography"

import { toPercent } from "../../utils"
import { Table, AttackChip } from "../../components"

const { calcPreModifierValue, calcBaseValue, getPossibleSpecialAttacks } = NightCombatSpecialAttack

const calcComplementaryProbability = (num: number) => 1 - (num > 1 ? 1 : num < 0 ? 0 : num)

const calcAtLeastOne = (nums: number[]) =>
  1 - nums.map(calcComplementaryProbability).reduce((prev, cur) => prev * cur, 1)

const calcNightContactRate = (arg: IShip | IShip[]): number => {
  if (!Array.isArray(arg)) {
    const { level, planes } = arg
    const probs = planes
      .filter(plane => plane.slotSize > 0 && plane.gear.masterId === 102)
      .map(plane => Math.floor(Math.sqrt(plane.gear.los) * Math.sqrt(level)) / 25)
    return calcAtLeastOne(probs)
  }

  const probs = arg.map(calcNightContactRate)
  return calcAtLeastOne(probs)
}

class NightCombatStore {
  public side = Side.Player
  public formation = Formation.LineAhead

  @observable
  public searchlight = false

  @observable
  public starshell = false

  public togglePlayerSearchlight = () => {
    this.searchlight = !this.searchlight
  }

  public togglePlayerStarshell = () => {
    this.starshell = !this.starshell
  }
}

const NightCombatStoreContext = createContext(new NightCombatStore())

const enemyBattleState = { side: Side.Enemy, formation: Formation.LineAhead, starshell: false, searchlight: false }

const attackRateRenderer = (cutinRates: Array<{ ci: NightCombatSpecialAttack; rate: number }>) => {
  return cutinRates.map(({ ci, rate }, index) => (
    <div key={index}>
      <AttackChip attack={ci} />
      <Typography variant="inherit" style={{ display: "inline-block", width: 50, marginLeft: 8 }}>
        {toPercent(rate)}
      </Typography>
    </div>
  ))
}

interface NightCombatSpecialAttackTable {
  fleet: IFleet
}

const NightCombatSpecialAttackTable: React.FC<NightCombatSpecialAttackTable> = props => {
  const { fleet } = props
  const nightBattleStore = useContext(NightCombatStoreContext)
  const contactRate = calcNightContactRate(fleet.nonNullableShips)

  const shipToCutinRate = (ship: IShip | undefined, index: number) => {
    if (!ship) {
      return
    }
    const isFlagship = index === 0
    const preModifierValue = calcPreModifierValue(ship)
    const baseValue = calcBaseValue(ship, isFlagship, nightBattleStore, enemyBattleState)

    const cis = getPossibleSpecialAttacks(ship)
    const cutinRates = new Array<{ ci: NightCombatSpecialAttack; rate: number }>()
    const totalRate = cis.reduce((acc, curCutin) => {
      let currentRate = (1 - acc) * curCutin.calcRate(baseValue)
      if (currentRate > 1) {
        currentRate = 1
      }
      cutinRates.push({ ci: curCutin, rate: currentRate })
      return acc + currentRate
    }, 0)

    return { name: ship.name, cis, preModifierValue, baseValue, cutinRates, totalRate }
  }

  const data = fleet.ships.map(shipToCutinRate).filter(nonNullable)
  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            onClick={nightBattleStore.togglePlayerSearchlight}
            checked={nightBattleStore.searchlight}
            color="primary"
          />
        }
        label="探照灯"
      />
      <FormControlLabel
        control={
          <Checkbox
            onClick={nightBattleStore.togglePlayerStarshell}
            checked={nightBattleStore.starshell}
            color="primary"
          />
        }
        label="照明弾"
      />
      <Typography>夜間触接率: {toPercent(contactRate)}</Typography>

      <Table
        data={data}
        columns={[
          { label: "艦娘", getValue: datum => datum.name, align: "left" },
          { label: "補正無しCI項", getValue: datum => datum.preModifierValue },
          { label: "CI項", getValue: datum => datum.baseValue },
          { label: "発動率", getValue: datum => attackRateRenderer(datum.cutinRates) },
          { label: "合計発動率", getValue: datum => toPercent(datum.totalRate) }
        ]}
      />
    </>
  )
}

export default observer(NightCombatSpecialAttackTable)
