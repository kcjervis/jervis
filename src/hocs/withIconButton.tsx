import React from 'react'
import classNames from 'classnames'

import { SvgIcon, Omit } from '@material-ui/core'
import IconButton, { IconButtonProps } from '@material-ui/core/IconButton'
import Tooltip, { TooltipProps } from '@material-ui/core/Tooltip'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
  small: {
    padding: 4
  }
})

export interface WithIconButtonProps extends Omit<IconButtonProps, 'size'> {
  label?: string
  size?: 'inherit' | 'default' | 'small' | 'large'
  title?: string
  tooltipProps?: Partial<TooltipProps>
  // バグ対策
  href?: string
}

const withIconButton = (WrappedIcon: typeof SvgIcon) => {
  const WithIconButton: React.FC<WithIconButtonProps> = ({ title, size, label, tooltipProps, ...iconButonProps }) => {
    const classes = useStyles()
    const WrappedButton = (
      <IconButton className={classNames({ [classes.small]: size === 'small' })} {...iconButonProps}>
        <WrappedIcon fontSize={size} />
        {label}
      </IconButton>
    )
    if (!title && tooltipProps && !tooltipProps.title) {
      return WrappedButton
    }
    return (
      <Tooltip title={title} {...tooltipProps}>
        {WrappedButton}
      </Tooltip>
    )
  }

  WithIconButton.displayName = `WithIconButton(${WrappedIcon.displayName})`
  return WithIconButton
}

export default withIconButton
