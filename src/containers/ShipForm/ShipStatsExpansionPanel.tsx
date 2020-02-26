import React from "react"
import { ShipStatKey } from "kc-calculator"
import { observer } from "mobx-react"
import clsx from "clsx"

import Button from "@material-ui/core/Button"
import Box from "@material-ui/core/Box"

import { makeStyles } from "@material-ui/core/styles"

import { MoraleBar, MoraleDialog, Text } from "../../components"
import { ObservableShip } from "../../stores"

import ShipStatDialog from "./ShipStatDialog"
import HealthBarDialog from "./HealthBarDialog"
import ShipBasicStats from "./ShipBasicStats"

const useStyles = makeStyles({
  summary: {
    padding: "0 8px"
  },
  summaryStat: {
    minWidth: 8 * 7
  },
  expanded: {
    opacity: 0
  }
})

interface ShipStatsExpansionPanelProps {
  ship: ObservableShip
  expanded?: boolean
}

const ShipStatsExpansionPanel: React.FC<ShipStatsExpansionPanelProps> = ({ ship, expanded = false }) => {
  const classes = useStyles()
  const summaryStatKeys: ShipStatKey[] = ["hp", "asw", "luck"]

  const kcShip = ship.asKcObject

  const handleMoraleChange = (value: number) => {
    ship.morale = value
  }

  if (!expanded) {
    return (
      <Box display="flex" flexGrow={1} className={clsx({ [classes.expanded]: expanded })}>
        {summaryStatKeys.map(statKey => (
          <ShipStatDialog key={statKey} className={classes.summaryStat} ship={ship} statKey={statKey} />
        ))}
      </Box>
    )
  }

  return (
    <>
      <HealthBarDialog ship={ship} />
      <MoraleDialog
        button={
          <Button fullWidth>
            <MoraleBar value={kcShip.morale.value} />
          </Button>
        }
        value={kcShip.morale.value}
        onChange={handleMoraleChange}
      />
      <ShipBasicStats ship={ship} />
    </>
  )
}

export default observer(ShipStatsExpansionPanel)
