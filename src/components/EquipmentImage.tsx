import React from 'react'

interface IEquipmentImageProps {
  className?: string
  masterId: number
}

const EquipmentIcon: React.SFC<IEquipmentImageProps> = ({ className, masterId }) => {
  if (masterId > 500) {
    return null
  }
  try {
    return <img className={className} src={require(`../images/equipments/itemOn/${masterId}.png`)} />
  } catch (error) {
    console.log(error)
    return null
  }
}

export default EquipmentIcon
