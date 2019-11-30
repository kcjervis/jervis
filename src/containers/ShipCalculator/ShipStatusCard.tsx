import React, { useState } from "react"
import { observer } from "mobx-react-lite"
import {
  ShipInformation,
  Engagement,
  DayCombatSpecialAttack,
  ShipShellingStatus,
  NightCombatSpecialAttack,
  ShipNightAttackStatus,
  BattleState,
  ShellingSupport,
  getFleetFactors
} from "kc-calculator"
import { round } from "lodash-es"
import clsx from "clsx"

import Box from "@material-ui/core/Box"
import Paper, { PaperProps } from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import Tooltip from "@material-ui/core/Tooltip"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Checkbox from "@material-ui/core/Checkbox"
import Divider from "@material-ui/core/Divider"
import { makeStyles } from "@material-ui/core/styles"

import { toPercent } from "../../utils"
import { Select, Table, Flexbox, Text, AttackChip, SelectButtons } from "../../components"
import { useSelect, useInput, useCheck } from "../../hooks"
import ShellingStats from "./ShellingStats"
import EnemyType from "./EnemyType"

import ShipTorpedoStatusCard from "./ShipTorpedoStatusCard"
import ShipAswStatusCard from "./ShipAswStatusCard"

const useStyles = makeStyles({
  root: {
    padding: 4
  },
  topText: { marginRight: 8 }
})

export const getAttackName = (attack?: DayCombatSpecialAttack | NightCombatSpecialAttack) => (
  <AttackChip attack={attack} />
)

type ShipStatusCardProps = {
  battleState: BattleState
  shipInformation: ShipInformation
  fleetFactors: ReturnType<typeof getFleetFactors>
  specialAttackRate: ReturnType<typeof DayCombatSpecialAttack.calcRate>
  nightContactModifier: number
  eventMapModifier: number
} & PaperProps

const ShipShellingStatusCard: React.FC<ShipStatusCardProps> = props => {
  const classes = useStyles()
  const attackTypeSelect = useSelect(["砲撃戦", "雷撃戦", "対潜", "夜戦"])
  const {
    battleState,
    shipInformation,
    fleetFactors,
    specialAttackRate,
    nightContactModifier,
    eventMapModifier,
    className,
    ...paperProps
  } = props
  const { ship, formation, role } = shipInformation
  const formationModifiers = formation.getModifiersWithRole(role)
  const engagementModifier = battleState.engagement.modifier
  const shellingStatus = new ShipShellingStatus(ship)

  const nightAttacks = new Array<NightCombatSpecialAttack | undefined>(undefined).concat(
    NightCombatSpecialAttack.getPossibleSpecialAttacks(shipInformation.ship)
  )

  const apCheck = useCheck()
  const enemyTypeSelect = useSelect(EnemyType.values)
  const target = enemyTypeSelect.value.ship

  const createShellingCellRenderer = (isCritical: boolean) => (specialAttack?: DayCombatSpecialAttack) => {
    const shellingPower = shellingStatus.calcPower({
      ...shipInformation,
      isCritical,
      engagement: battleState.engagement,
      combinedFleetFactor: fleetFactors.shelling,
      specialAttack,
      isArmorPiercing: apCheck.checked,
      eventMapModifier,
      target
    })
    const color = shellingPower.isCapped ? "secondary" : "inherit"
    return (
      <Tooltip title={<ShellingStats shellingPower={shellingPower} />}>
        <Typography variant="inherit" color={color}>
          {round(shellingPower.value, 4)}
        </Typography>
      </Tooltip>
    )
  }

  const nightStatus = new ShipNightAttackStatus(ship)
  const createNightCellRenderer = (isCritical: boolean) => (specialAttack: NightCombatSpecialAttack | undefined) => {
    const nightAttackPower = nightStatus.calcPower({
      ...shipInformation,
      nightContactModifier,
      specialAttack,
      isCritical,
      eventMapModifier,
      target
    })
    const color = nightAttackPower.isCapped ? "secondary" : "inherit"

    return (
      <Typography variant="inherit" color={color}>
        {round(nightAttackPower.value, 4)}
      </Typography>
    )
  }

  const visibleAp = ship.hasGear("ArmorPiercingShell") && ship.hasGear("MainGun")

  const createShellingSupportRenderer = (isCritical: boolean) => () => {
    const power = ShellingSupport.getShellingSupportPower({ battleState, attacker: shipInformation, isCritical })
    const color = power.isCapped ? "secondary" : "inherit"
    return (
      <Typography variant="inherit" color={color}>
        {round(power.value, 4)}
      </Typography>
    )
  }

  return (
    <Paper className={clsx(className, classes.root)} {...paperProps}>
      <Flexbox>
        <Text className={classes.topText}>簡易計算機</Text>
        <Text>装備命中 {ship.totalEquipmentStats(gear => gear.accuracy)}</Text>
      </Flexbox>
      <Flexbox alignItems="flex-end" mt={1}>
        <SelectButtons {...attackTypeSelect} />
        <Select label="敵種別" style={{ minWidth: 80, marginLeft: 8 }} {...enemyTypeSelect} />
        {visibleAp && <FormControlLabel label={`徹甲弾補正`} control={<Checkbox {...apCheck} />} />}
      </Flexbox>

      {attackTypeSelect.value === "砲撃戦" && (
        <Box mt={1}>
          <Table
            data={specialAttackRate.dayCombatAttacks}
            columns={[
              { label: "攻撃種別", getValue: getAttackName, align: "left" },
              { label: "発動率", getValue: attack => toPercent(specialAttackRate.getAttackRate(attack)) },
              { label: "最終攻撃力", getValue: createShellingCellRenderer(false) },
              { label: "クリティカル", getValue: createShellingCellRenderer(true) }
            ]}
          />
          <Typography variant="body2">合計特殊攻撃率 {toPercent(specialAttackRate.total)}</Typography>
          <Typography variant="subtitle2" style={{ marginTop: 16 }}>
            砲撃支援
          </Typography>
          <Table
            data={[0]}
            columns={[
              { label: "最終攻撃力", getValue: createShellingSupportRenderer(false) },
              { label: "クリティカル", getValue: createShellingSupportRenderer(true) }
            ]}
          />
        </Box>
      )}
      {attackTypeSelect.value === "雷撃戦" && (
        <ShipTorpedoStatusCard
          ship={ship}
          fleetFactor={fleetFactors.torpedo}
          formationModifier={formationModifiers.torpedo.power}
          engagementModifier={engagementModifier}
          a11={eventMapModifier}
        />
      )}
      {attackTypeSelect.value === "対潜" && (
        <ShipAswStatusCard
          ship={ship}
          formationModifier={formationModifiers.asw.power}
          engagementModifier={engagementModifier}
          a11={eventMapModifier}
        />
      )}
      {attackTypeSelect.value === "夜戦" && (
        <Box mt={1}>
          <Table
            data={nightAttacks}
            columns={[
              { label: "攻撃種別", getValue: getAttackName, align: "left" },
              { label: "最終攻撃力", getValue: createNightCellRenderer(false) },
              { label: "クリティカル", getValue: createNightCellRenderer(true) }
            ]}
          />
        </Box>
      )}
    </Paper>
  )
}

export default observer(ShipShellingStatusCard)
