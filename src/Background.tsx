import { makeStyles, Theme } from '@material-ui/core/styles'
import { random, range } from 'lodash-es'
import React from 'react'

import ShipImage from './components/ShipImage'

import { masterData } from './stores/kcObjectFactory'

const blur = 8

const useStyles = makeStyles({
  background: {
    background: `linear-gradient(
      180deg,
      rgba(25, 50, 75, 0.6),
      rgba(50, 40, 60, 0.8)
    )`,
    height: `calc(100vh + ${blur * 4}px)`,
    width: `calc(100vw + ${blur * 4}px)`,
    zIndex: -10000,
    position: 'fixed',
    top: -blur * 2,
    left: -blur * 2,
    textAlign: 'right',
    filter: `blur(${blur}px)`,
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
