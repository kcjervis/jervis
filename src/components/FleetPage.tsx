import React from 'react'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import { IFleet } from 'kc-calculator'

const styles = (theme: Theme) => createStyles({})

interface FleetPageProps extends WithStyles<typeof styles> {
  fleet: IFleet
}

const FleetPage: React.FC<FleetPageProps> = ({ fleet, classes, children }) => {
  return <div>{children}</div>
}

export default withStyles(styles)(FleetPage)
