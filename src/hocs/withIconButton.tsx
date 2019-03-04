import React from 'react'

import { SvgIcon } from '@material-ui/core'
import IconButton, { IconButtonProps } from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'

export interface WithIconButtonProps extends IconButtonProps {
  title?: string
  label?: string
  size?: 'inherit' | 'default' | 'small' | 'large'
}

const withIconButton = (WrappedIcon: typeof SvgIcon) => {
  const WithIconButton: React.FC<WithIconButtonProps> = ({ title, size, label, ...iconButonProps }) => {
    const WrappedButton = (
      <IconButton {...iconButonProps}>
        <WrappedIcon fontSize={size} />
        {label}
      </IconButton>
    )
    if (!title) {
      return WrappedButton
    }
    return <Tooltip title={title}>{WrappedButton}</Tooltip>
  }

  WithIconButton.displayName = `withIconButton(${WrappedIcon.name})`

  return WithIconButton
}

export default withIconButton
