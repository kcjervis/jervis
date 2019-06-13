import React from 'react'

interface EquipmentIconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  iconId: number
}

const EquipmentIcon = React.forwardRef<HTMLImageElement, EquipmentIconProps>((props, ref) => {
  const { iconId, ...rest } = props
  try {
    return <img ref={ref} src={require(`../images/equipmentIcons/${iconId}.png`)} {...rest} />
  } catch (error) {
    console.log(error)
    return null
  }
})

export default EquipmentIcon
