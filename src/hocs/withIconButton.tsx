import { SvgIcon } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import React from 'react'

interface IIconButtonProps {
  className?: string
  onClick: React.MouseEventHandler<HTMLInputElement>
  label?: string
}

const withIconButton = (WrappedIcon: typeof SvgIcon) => {
  const WithIconButton: React.SFC<IIconButtonProps> = ({ className, onClick, label }) => (
    <IconButton className={className} onClick={onClick}>
      <WrappedIcon />
      {label}
    </IconButton>
  )

  WithIconButton.displayName = `withIconButton(${WrappedIcon.name})`

  return WithIconButton
}

export default withIconButton
