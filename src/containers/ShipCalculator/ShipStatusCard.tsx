import React from 'react'
import { observer } from 'mobx-react-lite'
import {
  ShipInformation,
  Engagement,
  DayCombatSpecialAttack,
  ShipShellingStatus,
  InstallationType,
  NightBattleSpecialAttack,
  ShipNightAttackStatus
} from 'kc-calculator'
import { round } from 'lodash-es'
import clsx from 'clsx'

import Box from '@material-ui/core/Box'
import Paper, { PaperProps } from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import TextField from '@material-ui/core/TextField'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

import { toPercent } from '../../utils'
import { Select, Table, Flexbox } from '../../components'
import { useSelect, useInput, useCheck } from '../../hooks'
import ShellingStats from './ShellingStats'

const useStyles = makeStyles(
  createStyles({
    root: {
      padding: 4
    }
  })
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
  shipInformation: ShipInformation
  combinedFleetFactor: number
  specialAttackRate: ReturnType<typeof DayCombatSpecialAttack.calcRate>

  nightAttacks: Array<NightBattleSpecialAttack | undefined>
  nightContactModifier: number
} & PaperProps

const ShipShellingStatusCard: React.FC<ShipStatusCardProps> = props => {
  const classes = useStyles()
  const {
    shipInformation,
    combinedFleetFactor,
    specialAttackRate,
    nightAttacks,
    nightContactModifier,
    className,
    ...paperProps
  } = props
  const { ship } = shipInformation
  const shellingstatus = new ShipShellingStatus(ship)

  const options = new Array<DayCombatSpecialAttack | undefined>(undefined).concat(specialAttackRate.attacks)
  const specialAttackSelect = useSelect(options)
  const apCheck = useCheck()
  const installationTypeSelect = useInstallationTypeSelect()
  const eventMapModifier = useInput(1)

  const createShellingCellRenderer = (isCritical = false) => (engagement: Engagement) => {
    const shellingPower = shellingstatus.calcPower({
      ...shipInformation,
      isCritical,
      engagement,
      combinedFleetFactor,
      specialAttack: specialAttackSelect.value,
      isArmorPiercing: apCheck.checked,
      installationType: installationTypeSelect.value,
      eventMapModifier: eventMapModifier.value
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

  const createNightCellRenderer = (isCritical = false) => (specialAttack: NightBattleSpecialAttack | undefined) => {
    const nightAttackPower = nightStatus.calcPower({
      ...shipInformation,
      nightContactModifier,
      installationType: installationTypeSelect.value,
      specialAttack,
      isCritical,
      eventMapModifier: eventMapModifier.value
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
        <TextField label="イベント特効(a11)" style={{ width: 8 * 17 }} {...eventMapModifier} />
      </Flexbox>

      <Flexbox mt={1}>
        <Typography variant="subtitle2">砲撃戦</Typography>
        <Select
          style={{ minWidth: 80, marginLeft: 8 }}
          {...specialAttackSelect}
          getOptionLabel={option => (option ? option.name : '単発')}
        />

        {Array.from(specialAttackRate.rateMap).map(([specialAttack, rate]) => (
          <Typography key={specialAttack.id} variant="caption">
            {specialAttack.name} {toPercent(rate)}
          </Typography>
        ))}
        <Typography variant="caption">合計 {toPercent(specialAttackRate.total)}</Typography>
      </Flexbox>

      <Typography>攻撃力</Typography>
      <Table
        data={Engagement.values}
        columns={[
          { label: '交戦形態', getValue: engagement => engagement.name, align: 'left' },
          { label: '最終攻撃力', getValue: createShellingCellRenderer() },
          { label: 'クリティカル', getValue: createShellingCellRenderer(true) }
        ]}
      />

      <Typography variant="subtitle2">夜戦</Typography>
      <Typography>攻撃力</Typography>
      <Table
        data={nightAttacks}
        columns={[
          { label: '攻撃種別', getValue: attack => (attack ? attack.name : '単発'), align: 'left' },
          { label: '最終攻撃力', getValue: createNightCellRenderer(false) },
          { label: 'クリティカル', getValue: createNightCellRenderer(true) }
        ]}
      />
      <Typography>装備命中 {ship.totalEquipmentStats(equip => equip.accuracy)}</Typography>
    </Paper>
  )
}

export default observer(ShipShellingStatusCard)
