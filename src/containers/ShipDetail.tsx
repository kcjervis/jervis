import { IShip } from 'kc-calculator'
import React from 'react'

interface IShipDetailProps {
  ship: IShip
}

const ShipDetail: React.SFC<IShipDetailProps> = props => {
  return <div>{props.ship.name}</div>
}

export default ShipDetail
