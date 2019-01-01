import { SvgIcon } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import React from 'react'

interface IIconButtonProps {
  className?: string
  style?: React.CSSProperties
  onClick?: React.MouseEventHandler<HTMLInputElement>
  label?: string
  size?: 'inherit' | 'default' | 'small' | 'large'
}

const withIconButton = (WrappedIcon: typeof SvgIcon) => {
  const WithIconButton: React.SFC<IIconButtonProps> = ({ className, style, onClick, label, size }) => (
    <IconButton className={className} style={style} onClick={onClick}>
      <WrappedIcon fontSize={size} />
      {label}
    </IconButton>
  )

  WithIconButton.displayName = `withIconButton(${WrappedIcon.name})`

  return WithIconButton
}

export default withIconButton
