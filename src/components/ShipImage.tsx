import React from 'react'

import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'

interface ShipImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  masterId: number
  imageType: 'full' | 'banner'
}

const ShipImage: React.FC<ShipImageProps> = ({ masterId, imageType, ...rest }) => {
  try {
    return <img src={require(`../images/ships/${imageType}/${masterId}.png`)} {...rest} />
  } catch (error) {
    console.log(`ship ${masterId} image not found`)
    return (
      <Card style={{ display: 'inline-block' }} {...rest}>
        <Typography variant="h4">{masterId}</Typography>
      </Card>
    )
  }
}

export default ShipImage
