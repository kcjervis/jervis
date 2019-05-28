import { makeStyles } from '@material-ui/styles'
import { random, range } from 'lodash-es'
import React from 'react'

import ShipImage from './components/ShipImage'

import { masterData } from './stores/kcObjectFactory'

const useStyles = makeStyles({
  background: {
    background: `linear-gradient(
      180deg,
      rgba(25, 50, 75, 0.6),
      rgba(50, 40, 60, 0.8)
    )`,
    height: 'calc(100vh + 16px)',
    width: 'calc(100vw + 16px)',
    zIndex: -10000,
    position: 'fixed',
    top: -8,
    left: -8,
    textAlign: 'right',
    filter: 'blur(8px)',
    '&:before': {
      content: '""',
      position: 'fixed',
      display: 'block',
      height: '100%',
      width: '100%',
      background: 'inherit'
    }
  },
  image: {
    height: '100%'
  }
})

const getRandomShip = () => masterData.ships[random(masterData.ships.length - 1)]

const getRandomShipId = () => {
  let ship = getRandomShip()
  range(3).forEach(() => {
    if (ship.isAbyssal) {
      ship = getRandomShip()
    }
  })
  return ship.id
}

const Background: React.FC = props => {
  const classes = useStyles()
  return (
    <div className={classes.background}>
      <ShipImage className={classes.image} imageType="full" masterId={getRandomShipId()} />
    </div>
  )
}

export default Background
