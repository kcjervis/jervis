import React from 'react'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'

import { IFleet } from 'kc-calculator'

interface FleetPageProps {
  fleet: IFleet
}

const FleetPage: React.FC<FleetPageProps> = ({ fleet, children }) => {
  return <div>{children}</div>
}

export default FleetPage
