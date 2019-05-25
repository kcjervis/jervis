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
import EquipmentForm from '../EquipmentForm'

import ShipStatsExpansionPanel from './ShipStatsExpansionPanel'
import LevelChangeButton from './LevelChangeButton'

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

  const handleLevelChange = (value: number) => {
    ship.level = value
    if (ship.nowHp > ship.asKcObject.health.maxHp) {
      ship.nowHp = ship.asKcObject.health.maxHp
    }
  }

  return (
    <Paper
      {...paperProps}
      style={{ display: 'flex', padding: 4 }}
      onMouseOver={() => setVisibleButtons(true)}
      onMouseOut={() => setVisibleButtons(false)}
    >
      <div>
        <Box display="flex" alignItems="center" justifyContent="space-between" mr={2}>
          <Tooltip title={`ID: ${ship.masterId}`}>
            <Typography variant="caption">
              {ship.index + 1} {ship.asKcObject.name}
            </Typography>
          </Tooltip>
          <LevelChangeButton value={ship.level} onInput={handleLevelChange} />
          <div style={{ alignItems: 'right', visibility: visibleButtons ? undefined : 'hidden' }}>
            {/* <InfoButton title="詳細" size="small" onClick={() => openShipCalculator(ship)} /> */}
            {onUpdate && <UpdateButton title="艦娘を変更" size="small" onClick={onUpdate} />}
            <RemoveButton title="艦娘を削除" size="small" onClick={ship.remove} />
          </div>
        </Box>

        <ShipImage masterId={ship.masterId} imageType="banner" />

        <ShipStatsExpansionPanel ship={ship} defaultExpanded={defaultStatsExpanded} />
      </div>

      <Box width={256} height={8 * 3 * 6} flexShrink={0}>
        <EquipmentForm store={ship} />
      </Box>
    </Paper>
  )
}

export default observer(ShipCard)
