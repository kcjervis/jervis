import React from 'react'

interface IShipImageProps {
  className?: string
  masterId: number
  imageType: 'full' | 'banner'
}

const ShipImage: React.SFC<IShipImageProps> = ({ className, masterId, imageType }) => {
  try {
    return <img className={className} src={require(`../images/ships/${imageType}/${masterId}.png`)} />
  } catch (error) {
    console.log(error)
    return null
  }
}

export default ShipImage
