import React from 'react'

interface IShipBannerProps {
  className?: string
  masterId: number
}

const ShipBanner: React.SFC<IShipBannerProps> = ({ className, masterId }) => {
  try {
    return <img className={className} src={require(`../images/ships/banner/${masterId}.png`)} />
  } catch (error) {
    console.log(error)
    return null
  }
}

export default ShipBanner
