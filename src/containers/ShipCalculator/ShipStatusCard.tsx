import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import {
  ShipInformation,
  Engagement,
  DayCombatSpecialAttack,
  ShipShellingStatus,
  InstallationType,
  NightCombatSpecialAttack,
  ShipNightAttackStatus,
  BattleState
} from 'kc-calculator'
import { round } from 'lodash-es'
import clsx from 'clsx'

import Box from '@material-ui/core/Box'
import Paper, { PaperProps } from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Divider from '@material-ui/core/Divider'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

import { toPercent } from '../../utils'
import { Select, Table, Flexbox, NumberInput, AttackChip } from '../../components'
import { useSelect, useInput, useCheck } from '../../hooks'
import ShellingStats from './ShellingStats'

const useStyles = makeStyles(
  createStyles({
    root: {
      padding: 4
    }
  })
)

export const getAttackName = (attack?: DayCombatSpecialAttack | NightCombatSpecialAttack) => (
  <AttackChip attack={attack} />
)

const installationTypes: InstallationType[] = ['None', 'SoftSkinned', 'Pillbox', 'IsolatedIsland', 'SupplyDepot']
const installationTypeToJp = (type: InstallationType) =>
  ({ None: '水上艦', SoftSkinned: 'ソフトスキン', Pillbox: '砲台', IsolatedIsland: '離島', SupplyDepot: '集積' }[type])

export const useInstallationTypeSelect = (init?: InstallationType) => {
  const select = useSelect(installationTypes, init)
  const getOptionLabel = installationTypeToJp
  return { ...select, getOptionLabel }
}

type ShipStatusCardProps = {
  battleState: BattleState
  shipInformation: ShipInformation
  combinedFleetFactor: number
  specialAttackRate: ReturnType<typeof DayCombatSpecialAttack.calcRate>

  nightAttacks: Array<NightCombatSpecialAttack | undefined>
  nightContactModifier: number
} & PaperProps

const ShipShellingStatusCard: React.FC<ShipStatusCardProps> = props => {
  const classes = useStyles()
  const {
    battleState,
    shipInformation,
    combinedFleetFactor,
    specialAttackRate,
    nightAttacks,
    nightContactModifier,
    className,
    ...paperProps
  } = props
  const { ship } = shipInformation
  const shellingStatus = new ShipShellingStatus(ship)

  const apCheck = useCheck()
  const installationTypeSelect = useInstallationTypeSelect()
  const [eventMapModifier, setEventMapModifier] = useState(1)

  const createShellingCellRenderer = (isCritical: boolean) => (specialAttack?: DayCombatSpecialAttack) => {
    const shellingPower = shellingStatus.calcPower({
      ...shipInformation,
      isCritical,
      engagement: battleState.engagement,
      combinedFleetFactor,
      specialAttack,
      isArmorPiercing: apCheck.checked,
      installationType: installationTypeSelect.value,
      eventMapModifier
    })
    const color = shellingPower.isCapped ? 'secondary' : 'inherit'
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
      installationType: installationTypeSelect.value,
      specialAttack,
      isCritical,
      eventMapModifier
    })
    const color = nightAttackPower.isCapped ? 'secondary' : 'inherit'

    return (
      <Typography variant="inherit" color={color}>
        {round(nightAttackPower.value, 4)}
      </Typography>
    )
  }

  const visibleAp = ship.hasEquipmentCategory('ArmorPiercingShell') && ship.hasEquipmentCategory(cate => cate.isMainGun)

  return (
    <Paper className={clsx(className, classes.root)} {...paperProps}>
      <Flexbox mt={1}>
        <Typography variant="subtitle2">簡易計算機</Typography>
        <Select label="敵種別" style={{ minWidth: 80, marginLeft: 8 }} {...installationTypeSelect} />
        {visibleAp && <FormControlLabel label={`徹甲弾補正`} control={<Checkbox {...apCheck} />} />}
        <NumberInput
          label="イベント特効(a11)"
          style={{ width: 8 * 17 }}
          step={0.1}
          value={eventMapModifier}
          onChange={setEventMapModifier}
        />
      </Flexbox>

      <Typography style={{ marginTop: 8 }} variant="subtitle2">
        砲撃戦
      </Typography>
      <Table
        data={specialAttackRate.dayCombatAttacks}
        columns={[
          { label: '攻撃種別', getValue: getAttackName, align: 'left' },
          { label: '発動率', getValue: attack => toPercent(specialAttackRate.getAttackRate(attack)) },
          { label: '最終攻撃力', getValue: createShellingCellRenderer(false) },
          { label: 'クリティカル', getValue: createShellingCellRenderer(true) }
        ]}
      />
      <Typography variant="caption">合計特殊攻撃率 {toPercent(specialAttackRate.total)}</Typography>

      <Flexbox mt={1} />
      <Typography variant="subtitle2">夜戦</Typography>
      <Table
        data={nightAttacks}
        columns={[
          { label: '攻撃種別', getValue: getAttackName, align: 'left' },
          { label: '最終攻撃力', getValue: createNightCellRenderer(false) },
          { label: 'クリティカル', getValue: createNightCellRenderer(true) }
        ]}
      />
      <Typography>装備命中 {ship.totalEquipmentStats(equip => equip.accuracy)}</Typography>
    </Paper>
  )
}

export default observer(ShipShellingStatusCard)
