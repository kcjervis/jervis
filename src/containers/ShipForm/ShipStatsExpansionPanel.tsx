import React, { useState, useCallback, useEffect } from 'react'
import { shipStatKeys, ShipStatKey } from 'kc-calculator'
import { observer } from 'mobx-react-lite'
import clsx from 'clsx'

import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Box from '@material-ui/core/Box'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

import ShipStatDialog from './ShipStatDialog'
import HealthBarDialog from './HealthBarDialog'
import ShipStatLabel from './ShipStatLabel'

import { ObservableShip } from '../../stores'
import { MoraleBar, MoraleDialog } from '../../components'

const useStyles = makeStyles(
  createStyles({
    summary: {
      padding: '0 8px'
    },
    summaryStat: {
      minWidth: 8 * 7
    },
    expanded: {
      opacity: 0
    }
  })
)

interface ShipStatsExpansionPanelProps {
  ship: ObservableShip
  defaultExpanded?: boolean
}

const ShipStatsExpansionPanel: React.FC<ShipStatsExpansionPanelProps> = ({ ship, defaultExpanded = false }) => {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const toggle = useCallback(() => setExpanded(value => !value), [])

  useEffect(() => {
    setExpanded(defaultExpanded)
  }, [defaultExpanded])

  const classes = useStyles()
  const summaryStatKeys: ShipStatKey[] = ['hp', 'asw', 'luck']

  const shipStatRenderer = (statKey: ShipStatKey) => {
    if (statKey === 'antiAir') {
      return (
        <React.Fragment key={statKey}>
          <Grid item={true} xs={6} key={statKey}>
            <ShipStatDialog statKey={statKey} ship={ship} />
          </Grid>
          <Grid item={true} xs={6}>
            <Typography variant="subtitle2" style={{ padding: 4 }}>
              制空: {ship.asKcObject.fighterPower}
            </Typography>
          </Grid>
        </React.Fragment>
      )
    }
    return (
      <Grid item={true} xs={6} key={statKey}>
        <ShipStatDialog statKey={statKey} ship={ship} />
      </Grid>
    )
  }

  const { morale } = ship.asKcObject
  const handleMoraleChange = (value: number) => {
    ship.morale = value
  }

  return (
    <ExpansionPanel style={{ margin: 0 }} expanded={expanded} elevation={0}>
      <ExpansionPanelSummary className={classes.summary} onClick={toggle} expandIcon={<ExpandMoreIcon />}>
        <Box display="flex" flexGrow={1} className={clsx({ [classes.expanded]: expanded })}>
          {summaryStatKeys.map(statKey => (
            <ShipStatLabel key={statKey} className={classes.summaryStat} ship={ship} statKey={statKey} />
          ))}
        </Box>
      </ExpansionPanelSummary>

      <HealthBarDialog ship={ship} />
      <MoraleDialog
        button={
          <Button fullWidth>
            <MoraleBar value={morale.value} />
          </Button>
        }
        value={morale.value}
        onChange={handleMoraleChange}
      />

      <Grid container={true}>{shipStatKeys.map(shipStatRenderer)}</Grid>
    </ExpansionPanel>
  )
}

export default ShipStatsExpansionPanel
