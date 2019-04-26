import { observer } from 'mobx-react-lite'
import React, { useContext } from 'react'
import clsx from 'clsx'

import Paper, { PaperProps } from '@material-ui/core/Paper'
import Input from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'
import { makeStyles } from '@material-ui/styles'

import { ShipImage, InfoButton, RemoveButton, UpdateButton } from '../../components'
import EquipmentField from '../EquipmentField'

import ShipStatsExpansionPanel from './ShipStatsExpansionPanel'

import { ObservableFleet, ObservableShip } from '../../stores'
import { useWorkspace } from '../../hooks'

const useStyles = makeStyles({
  top: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  shipImage: {
    display: 'flex',
    justifyContent: 'space-around'
  },
  equipments: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  equipment: {
    marginTop: 4,
    height: 8 * 4
  }
})

interface ShipCardProps extends PaperProps {
  ship: ObservableShip
  defaultStatsExpanded?: boolean
  onUpdate: () => void
}

const ShipCard: React.FC<ShipCardProps> = ({ ship, onUpdate, defaultStatsExpanded, ...paperProps }) => {
  const classes = useStyles()
  const { openShipCalculator } = useWorkspace()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    ship.level = Number(event.target.value)
    ship.nowHp = ship.asKcObject.health.maxHp
  }

  return (
    <Paper {...paperProps}>
      <div className={classes.top}>
        <Tooltip title={`ID: ${ship.masterId}`}>
          <Typography variant="caption">
            {ship.index + 1} {ship.asKcObject.name}
          </Typography>
        </Tooltip>
        <div style={{ alignItems: 'right' }}>
          <InfoButton size="small" onClick={() => openShipCalculator(ship)} />
          <UpdateButton title="艦娘を変更" size="small" onClick={onUpdate} />
          <RemoveButton title="艦娘を削除" size="small" onClick={ship.remove} />
        </div>
      </div>

      <div className={classes.shipImage}>
        <ShipImage masterId={ship.masterId} imageType="banner" />
        <Input
          style={{ width: 70 }}
          startAdornment={<InputAdornment position="start">Lv</InputAdornment>}
          value={ship.level}
          type="number"
          disableUnderline={true}
          onChange={handleChange}
          inputProps={{ min: 1 }}
        />
      </div>

      <ShipStatsExpansionPanel ship={ship} defaultExpanded={defaultStatsExpanded} />

      {ship.equipments.map((equip, index) => (
        <EquipmentField key={index} className={classes.equipment} store={ship} index={index} equipment={equip} />
      ))}
    </Paper>
  )
}

export default observer(ShipCard)
