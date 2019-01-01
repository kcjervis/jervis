import React from 'react'

interface IEquipmentIconProps {
  style?: React.CSSProperties
  className?: string
  iconId: number
}

const EquipmentIcon: React.SFC<IEquipmentIconProps> = ({ style, className, iconId }) => {
  try {
    return <img className={className} style={style} src={require(`../images/equipmentIcons/${iconId}.png`)} />
  } catch (error) {
    console.log(error)
    return null
  }
}

export default EquipmentIcon
