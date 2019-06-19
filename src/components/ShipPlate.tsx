import React from 'react'

import { IShip, shipStatKeys } from 'kc-calculator'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'

import { makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import ShipImage from './ShipImage'
import StatChip from './StatChip'

const useStyles = makeStyles((theme: Theme) => ({
  flexContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    padding: 0,
    paddingBottom: theme.spacing(1),
    '&:last-child': {
      paddingBottom: 0
    }
  },
  flexContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing(1),
    minWidth: 200,
    height: 50
  }
}))

interface ShipPlateProps {
  ship?: IShip
}

const ShipPlate: React.FC<ShipPlateProps> = ({ ship, children }) => {
  const classes = useStyles()
  if (!ship) {
    return null
  }

  const { name, level } = ship
  return (
    <Card>
      <CardContent style={{ display: 'flex', alignItems: 'center' }}>
        <ShipImage masterId={ship.masterId} imageType="banner" />
        <Typography>{name}</Typography>
        <Typography>Lv {level}</Typography>
      </CardContent>
      <CardContent>
        {/* 艦娘ステータス */}
        {shipStatKeys.map(statKey => (
          <StatChip key={statKey} statKey={statKey} value={ship.stats[statKey]} />
        ))}
      </CardContent>
      {children}
    </Card>
  )
}

export default ShipPlate
