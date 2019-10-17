import React from "react"

type GearImageProps = React.ComponentProps<"img"> & {
  masterId: number
}

const GearImage: React.FC<GearImageProps> = ({ masterId, ...rest }) => {
  if (masterId > 500) {
    return null
  }
  try {
    return (
      <img style={{ pointerEvents: "none" }} src={require(`../images/equipments/itemOn/${masterId}.png`)} {...rest} />
    )
  } catch (error) {
    console.log(`gear ${masterId} image not found`)
    return null
  }
}

export default GearImage
