import React from 'react'

interface IEquipmentIconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  iconId: number
}

const EquipmentIcon: React.FC<IEquipmentIconProps> = ({ iconId, ...rest }) => {
  try {
    return <img style={{ pointerEvents: 'none' }} src={require(`../images/equipmentIcons/${iconId}.png`)} {...rest} />
  } catch (error) {
    console.log(error)
    return null
  }
}

export default EquipmentIcon
