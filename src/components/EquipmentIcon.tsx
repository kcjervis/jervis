import React from 'react'

interface EquipmentIconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  iconId: number
}

const EquipmentIcon: React.FC<EquipmentIconProps> = ({ iconId, ...rest }) => {
  try {
    return <img style={{ pointerEvents: 'none' }} src={require(`../images/equipmentIcons/${iconId}.png`)} {...rest} />
  } catch (error) {
    console.log(error)
    return null
  }
}

export default EquipmentIcon
