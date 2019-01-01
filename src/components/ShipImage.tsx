import React from 'react'

import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'

interface IShipImageProps {
  className?: string
  masterId: number
  imageType: 'full' | 'banner'
}

const ShipImage: React.SFC<IShipImageProps> = ({ className, masterId, imageType }) => {
  try {
    return <img className={className} src={require(`../images/ships/${imageType}/${masterId}.png`)} />
  } catch (error) {
    console.log(`ship ${masterId} image not found`)
    return (
      <Card style={{ display: 'inline-block' }}>
        <Typography variant="h4">{masterId}</Typography>
      </Card>
    )
  }
}

export default ShipImage
