import { makeStyles } from '@material-ui/styles'
import random from 'lodash/random'
import range from 'lodash/range'
import React from 'react'

import ShipImage from './components/ShipImage'

import { masterData } from './stores/kcObjectFactory'

const useStyles = makeStyles({
  background: {
    background: `linear-gradient(
      180deg,
      rgba(0, 52, 119, 0.8),
      rgba(139, 49, 67, 0.9)
    )`,
    height: 'calc(100vh + 16px)',
    width: 'calc(100vw + 16px)',
    zIndex: -10000,
    position: 'fixed',
    top: -8,
    left: -8,
    textAlign: 'right',
    filter: 'blur(4px)',
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
