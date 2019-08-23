import React from 'react'

interface GearIconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  iconId: number
}

const GearIcon = React.forwardRef<HTMLImageElement, GearIconProps>((props, ref) => {
  const { iconId, ...rest } = props
  try {
    return <img ref={ref} src={require(`../images/equipmentIcons/${iconId}.png`)} {...rest} />
  } catch (error) {
    console.log(error)
    return null
  }
})

export default GearIcon
