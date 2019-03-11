import React from 'react'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'

import { IShip } from 'kc-calculator'
import { BattleType } from 'kc-calculator'

interface ShipStatsPageProps {
  ship: IShip
}

const ShipStatsPage: React.FC<ShipStatsPageProps> = ({ ship }) => {
  const battleType = BattleType.AerialBattle
  return <Card />
}

export default ShipStatsPage
