import { SvgIcon } from '@material-ui/core'
import IconButton, { IconButtonProps } from '@material-ui/core/IconButton'
import React from 'react'

interface IWithIconButtonProps extends IconButtonProps {
  label?: string
  size?: 'inherit' | 'default' | 'small' | 'large'
}

const withIconButton = (WrappedIcon: typeof SvgIcon) => {
  const WithIconButton: React.FC<IWithIconButtonProps> = ({ size, label, ...iconButonProps }) => (
    <IconButton {...iconButonProps}>
      <WrappedIcon fontSize={size} />
      {label}
    </IconButton>
  )

  WithIconButton.displayName = `withIconButton(${WrappedIcon.name})`

  return WithIconButton
}

export default withIconButton
