import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import clsx from 'clsx'

import Paper, { PaperProps } from '@material-ui/core/Paper'
import Input from '@material-ui/core/Input'
import Box from '@material-ui/core/Box'
import InputAdornment from '@material-ui/core/InputAdornment'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'
import { makeStyles } from '@material-ui/core/styles'

import { ShipImage, InfoButton, ClearButton, UpdateButton } from '../../components'
import EquipmentField from '../EquipmentField'
import EquipmentForm from '../EquipmentForm'

import ShipStatsExpansionPanel from './ShipStatsExpansionPanel'
import LevelChangeButton from './LevelChangeButton'

import { ObservableShip } from '../../stores'
import { useWorkspace } from '../../hooks'

const statsWidth = 8 * 27

const useStyles = makeStyles({
  root: {
    display: 'flex',
    padding: 4
  },
  stats: {
    width: statsWidth
  },
  equipment: {
    height: 8 * 3 * 6,
    width: `calc(100% - ${statsWidth}px)`
  }
})

interface ShipCardProps extends PaperProps {
  ship: ObservableShip
  defaultStatsExpanded?: boolean
  onUpdate?: () => void
  disableButton?: boolean
  visibleInfo?: boolean
}

const ShipCard: React.FC<ShipCardProps> = ({
  ship,
  onUpdate,
  defaultStatsExpanded,
  disableButton,
  visibleInfo = true,
  className,
  ...paperProps
}) => {
  const classes = useStyles()
  const { openShipCalculator } = useWorkspace()
  const [visibleButtons, setVisibleButtons] = useState(false)

  const handleLevelChange = (next: number) => {
    const prev = ship.level
    ship.level = next
    if (prev <= 99 && next >= 100) {
      ship.nowHp = ship.asKcObject.health.maxHp
    }
    if (ship.nowHp > ship.asKcObject.health.maxHp) {
      ship.nowHp = ship.asKcObject.health.maxHp
    }
  }

  const visibility = !disableButton && visibleButtons ? undefined : 'hidden'

  return (
    <Paper
      {...paperProps}
      className={clsx(classes.root, className)}
      onMouseOver={() => setVisibleButtons(true)}
      onMouseOut={() => setVisibleButtons(false)}
    >
      <div className={classes.stats}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mr={2}>
          <Tooltip title={`ID: ${ship.masterId}`}>
            <Typography variant="caption">
              {ship.index + 1} {ship.asKcObject.name}
            </Typography>
          </Tooltip>
          <LevelChangeButton value={ship.level} onInput={handleLevelChange} />
          <div style={{ alignItems: 'right', visibility }}>
            {visibleInfo && <InfoButton title="詳細" size="small" onClick={() => openShipCalculator(ship)} />}
            {onUpdate && <UpdateButton title="変更" size="small" onClick={onUpdate} />}
            <ClearButton title="削除" size="small" onClick={ship.remove} />
          </div>
        </Box>

        <ShipImage masterId={ship.masterId} imageType="banner" />

        <ShipStatsExpansionPanel ship={ship} defaultExpanded={defaultStatsExpanded} />
      </div>

      <Box className={classes.equipment}>
        <EquipmentForm store={ship} />
      </Box>
    </Paper>
  )
}

export default observer(ShipCard)
