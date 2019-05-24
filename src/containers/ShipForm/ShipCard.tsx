import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import clsx from 'clsx'

import Paper, { PaperProps } from '@material-ui/core/Paper'
import Input from '@material-ui/core/Input'
import Box from '@material-ui/core/Box'
import InputAdornment from '@material-ui/core/InputAdornment'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'
import { makeStyles } from '@material-ui/styles'

import { ShipImage, InfoButton, RemoveButton, UpdateButton } from '../../components'
import EquipmentField from '../EquipmentField'

import ShipStatsExpansionPanel from './ShipStatsExpansionPanel'

import { ObservableShip } from '../../stores'
import { useWorkspace } from '../../hooks'

const useStyles = makeStyles({
  equipment: {
    marginTop: 4,
    height: 8 * 4
  }
})

interface ShipCardProps extends PaperProps {
  ship: ObservableShip
  defaultStatsExpanded?: boolean
  onUpdate?: () => void
}

const ShipCard: React.FC<ShipCardProps> = ({ ship, onUpdate, defaultStatsExpanded, ...paperProps }) => {
  const classes = useStyles()
  const { openShipCalculator } = useWorkspace()
  const [visibleButtons, setVisibleButtons] = useState(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    ship.level = Number(event.target.value)
    ship.nowHp = ship.asKcObject.health.maxHp
  }

  return (
    <Paper {...paperProps} onMouseOver={() => setVisibleButtons(true)} onMouseOut={() => setVisibleButtons(false)}>
      <Box display="flex" justifyContent="space-between">
        <Tooltip title={`ID: ${ship.masterId}`}>
          <Typography variant="caption">
            {ship.index + 1} {ship.asKcObject.name}
          </Typography>
        </Tooltip>
        <div style={{ alignItems: 'right', visibility: visibleButtons ? undefined : 'hidden' }}>
          {/* <InfoButton title="詳細" size="small" onClick={() => openShipCalculator(ship)} /> */}
          {onUpdate && <UpdateButton title="艦娘を変更" size="small" onClick={onUpdate} />}
          <RemoveButton title="艦娘を削除" size="small" onClick={ship.remove} />
        </div>
      </Box>

      <Box display="flex" justifyContent="space-around">
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
      </Box>

      <ShipStatsExpansionPanel ship={ship} defaultExpanded={defaultStatsExpanded} />

      {ship.equipments.map((equip, index) => (
        <EquipmentField key={index} className={classes.equipment} store={ship} index={index} equipment={equip} />
      ))}
    </Paper>
  )
}

export default observer(ShipCard)
