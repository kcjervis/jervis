import React from 'react'

interface IEquipmentIconProps {
  className?: string
  iconId: number
}

const EquipmentIcon: React.SFC<IEquipmentIconProps> = ({ className, iconId }) => {
  try {
    return <img className={className} src={require(`../images/equipmentIcons/${iconId}.png`)} />
  } catch (error) {
    console.log(error)
    return null
  }
}

export default EquipmentIcon
