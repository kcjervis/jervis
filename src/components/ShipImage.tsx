import React from 'react'

import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'

interface IShipImageProps {
  masterId: number
  imageType: 'full' | 'banner'
  className?: string
  style?: React.CSSProperties
}

const ShipImage: React.SFC<IShipImageProps> = ({ className, masterId, imageType, style }) => {
  try {
    return <img className={className} style={style} src={require(`../images/ships/${imageType}/${masterId}.png`)} />
  } catch (error) {
    console.log(`ship ${masterId} image not found`)
    return (
      <Card style={{ display: 'inline-block', ...style }}>
        <Typography variant="h4">{masterId}</Typography>
      </Card>
    )
  }
}

export default ShipImage
