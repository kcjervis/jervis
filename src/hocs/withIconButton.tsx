import { SvgIcon } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import React from 'react'

const withIconButton = (WrappedIcon: typeof SvgIcon) => {
  const WithIconButton: React.SFC<{
    className?: string
    onClick: React.MouseEventHandler<HTMLInputElement>
    label?: string
  }> = ({ className, onClick, label }) => (
    <IconButton className={className} onClick={onClick}>
      <WrappedIcon />
      {label}
    </IconButton>
  )

  WithIconButton.displayName = `withIconButton(${WrappedIcon.name})`

  return WithIconButton
}

export default withIconButton
