import React, { useState, useCallback, useEffect } from 'react'
import { shipStatKeys, ShipStatKey } from 'kc-calculator'
import { observer } from 'mobx-react-lite'
import classNames from 'classnames'

import { Theme } from '@material-ui/core'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { makeStyles, createStyles } from '@material-ui/styles'
import Grid from '@material-ui/core/Grid'

import ShipStatDialog from './ShipStatDialog'
import HealthBarDialog from './HealthBarDialog'
import ShipStatLabel from './ShipStatLabel'

import { ObservableShip } from '../../stores'

const useStyles = makeStyles(
  createStyles({
    summary: {
      padding: '0 8px'
    },
    summaryStats: {
      display: 'flex',
      flexGrow: 1
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
  open?: boolean
}

const ShipStatsExpansionPanel: React.FC<ShipStatsExpansionPanelProps> = ({ ship, open = false }) => {
  const [expanded, setExpanded] = useState(open)
  const toggle = useCallback(() => setExpanded(value => !value), [])
  useEffect(() => {
    setExpanded(open)
  }, [open])
  const classes = useStyles()
  const summaryStatKeys: ShipStatKey[] = ['hp', 'asw', 'luck']
  return (
    <ExpansionPanel expanded={expanded} elevation={0}>
      <ExpansionPanelSummary className={classes.summary} onClick={toggle} expandIcon={<ExpandMoreIcon />}>
        <div className={classNames(classes.summaryStats, { [classes.expanded]: expanded })}>
          {summaryStatKeys.map(statKey => (
            <ShipStatLabel key={statKey} className={classes.summaryStat} ship={ship} statKey={statKey} />
          ))}
        </div>
      </ExpansionPanelSummary>

      <HealthBarDialog ship={ship} />

      <Grid container={true}>
        {shipStatKeys.map(statKey => (
          <Grid item={true} xs={6} key={statKey}>
            <ShipStatDialog statKey={statKey} ship={ship} />
          </Grid>
        ))}
      </Grid>
    </ExpansionPanel>
  )
}

export default ShipStatsExpansionPanel
