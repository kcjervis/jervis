import React from 'react'

interface IEquipmentImageProps {
  className?: string
  masterId: number
}

const EquipmentImage: React.SFC<IEquipmentImageProps> = ({ className, masterId }) => {
  if (masterId > 500) {
    return null
  }
  try {
    return (
      <img
        style={{ pointerEvents: 'none' }}
        className={className}
        src={require(`../images/equipments/itemOn/${masterId}.png`)}
      />
    )
  } catch (error) {
    console.log(`equipment ${masterId} image not found`)
    return null
  }
}

export default EquipmentImage
