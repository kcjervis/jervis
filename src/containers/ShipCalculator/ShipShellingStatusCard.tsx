import React from 'react'
import { observer } from 'mobx-react-lite'
import {
  ShipInformation,
  Engagement,
  DayCombatSpecialAttack,
  ShipShellingStatus,
  InstallationType
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
import { makeStyles, createStyles } from '@material-ui/core/styles'

import { toPercent } from '../../utils'
import { Select, Table } from '../../components'
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

type ShipShellingStatusCardProps = {
  shipInformation: ShipInformation
  combinedFleetFactor: number
  specialAttackRate: ReturnType<typeof DayCombatSpecialAttack.calcRate>
} & PaperProps

const ShipShellingStatusCard: React.FC<ShipShellingStatusCardProps> = props => {
  const classes = useStyles()
  const { shipInformation, combinedFleetFactor, specialAttackRate, className, ...paperProps } = props
  const { ship } = shipInformation
  const status = new ShipShellingStatus(ship)

  const options = new Array<DayCombatSpecialAttack | undefined>(undefined).concat(specialAttackRate.attacks)
  const specialAttackSelect = useSelect(options)
  const apCheck = useCheck()
  const installationTypeSelect = useInstallationTypeSelect()

  const eventMapModifier = useInput(1)

  const createCellRenderer = (isCritical = false) => (engagement: Engagement) => {
    const shellingPower = status.calcPower({
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

  const visibleAp = ship.hasEquipmentCategory('ArmorPiercingShell') && ship.hasEquipmentCategory(cate => cate.isMainGun)

  return (
    <Paper className={clsx(className, classes.root)} {...paperProps}>
      <Typography variant="subtitle2">砲撃戦(簡易)</Typography>

      <Box display="flex" alignItems="end" mt={1}>
        <Select
          style={{ minWidth: 80, marginLeft: 8 }}
          {...specialAttackSelect}
          getOptionLabel={option => (option ? option.name : '単発')}
        />

        <Select label="敵種別" style={{ minWidth: 80, marginLeft: 8 }} {...installationTypeSelect} />
        {visibleAp && <FormControlLabel label={`徹甲弾補正`} control={<Checkbox {...apCheck} />} />}
        <TextField label="イベント特効(a11)" style={{ width: 8 * 17 }} {...eventMapModifier} />
      </Box>

      <Typography>攻撃力</Typography>
      <Table
        data={Engagement.values}
        columns={[
          { label: '交戦形態', getValue: engagement => engagement.name, align: 'left' },
          { label: '最終攻撃力', getValue: createCellRenderer() },
          { label: 'クリティカル', getValue: createCellRenderer(true) }
        ]}
      />

      <Typography>特殊攻撃</Typography>
      {Array.from(specialAttackRate.rateMap).map(([specialAttack, rate]) => (
        <Typography key={specialAttack.id}>
          {specialAttack.name} {toPercent(rate)}
        </Typography>
      ))}
      <Typography>合計 {toPercent(specialAttackRate.total)}</Typography>
    </Paper>
  )
}

export default observer(ShipShellingStatusCard)
