import { observer } from "mobx-react-lite"
import React, { useState } from "react"
import clsx from "clsx"

import Paper, { PaperProps } from "@material-ui/core/Paper"
import Box from "@material-ui/core/Box"
import Tooltip from "@material-ui/core/Tooltip"
import { makeStyles } from "@material-ui/core/styles"

import { ShipBanner, InfoButton, ClearButton, UpdateButton, Text, Flexbox } from "../../components"
import EquipmentForm from "../EquipmentForm"

import ShipStatsExpansionPanel from "./ShipStatsExpansionPanel"
import LevelChangeButton from "./LevelChangeButton"

import { ObservableShip } from "../../stores"
import { useWorkspace } from "../../hooks"
import ShipDetailedStats from "./ShipDetailedStats"

const statsWidth = 8 * 28

const useStyles = makeStyles({
  root: {
    padding: 4,
    width: 8 * 60
  },
  stats: {
    width: statsWidth
  },
  equipment: {
    height: 8 * 3 * 6,
    width: `calc(100% - ${statsWidth}px)`
  },
  detailedStats: {
    marginTop: 8
  }
})

interface ShipCardProps extends PaperProps {
  ship: ObservableShip
  expanded?: boolean
  onUpdate?: () => void
  disableButton?: boolean
  visibleInfo?: boolean
}

const ShipCard: React.FC<ShipCardProps> = ({
  ship,
  onUpdate,
  expanded,
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
      ship.currentHp = ship.asKcObject.health.maxHp
    }
    if (ship.currentHp > ship.asKcObject.health.maxHp) {
      ship.currentHp = ship.asKcObject.health.maxHp
    }
  }

  const visibility = !disableButton && visibleButtons ? undefined : "hidden"

  return (
    <Paper
      {...paperProps}
      className={clsx(classes.root, className)}
      onMouseOver={() => setVisibleButtons(true)}
      onMouseOut={() => setVisibleButtons(false)}
    >
      <Flexbox alignItems="flex-start">
        <div className={classes.stats}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mr={2}>
            <Tooltip title={`ID: ${ship.masterId}`}>
              <Text noWrap style={{ maxWidth: 8 * 11 }}>
                {ship.index + 1} {ship.asKcObject.name}
              </Text>
            </Tooltip>
            <LevelChangeButton value={ship.level} onInput={handleLevelChange} />
            <div style={{ alignItems: "right", visibility }}>
              {visibleInfo && <InfoButton title="詳細" size="small" onClick={() => openShipCalculator(ship)} />}
              {onUpdate && <UpdateButton title="変更" size="small" onClick={onUpdate} />}
              <ClearButton title="削除" size="small" onClick={ship.remove} />
            </div>
          </Box>

          <ShipBanner shipId={ship.masterId} />

          <ShipStatsExpansionPanel ship={ship} expanded={expanded} />
        </div>

        <Box className={classes.equipment}>
          <EquipmentForm store={ship} />
          {expanded && <ShipDetailedStats className={classes.detailedStats} ship={ship.asKcObject} />}
        </Box>
      </Flexbox>
    </Paper>
  )
}

export default observer(ShipCard)
