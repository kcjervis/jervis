import React from 'react'

interface IEquipmentImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  masterId: number
}

const EquipmentImage: React.FC<IEquipmentImageProps> = ({ masterId, ...rest }) => {
  if (masterId > 500) {
    return null
  }
  try {
    return (
      <img style={{ pointerEvents: 'none' }} src={require(`../images/equipments/itemOn/${masterId}.png`)} {...rest} />
    )
  } catch (error) {
    console.log(`equipment ${masterId} image not found`)
    return null
  }
}

export default EquipmentImage
