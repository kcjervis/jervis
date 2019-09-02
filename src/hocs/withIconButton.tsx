import React from "react"

import { SvgIcon } from "@material-ui/core"
import IconButton, { IconButtonProps } from "@material-ui/core/IconButton"
import Tooltip, { TooltipProps } from "@material-ui/core/Tooltip"

export interface WithIconButtonProps extends IconButtonProps {
  label?: string
  title?: string
  tooltipProps?: Partial<TooltipProps>
  // バグ対策
  href?: string
}

const withIconButton = (WrappedIcon: typeof SvgIcon) => {
  const WithIconButton: React.FC<WithIconButtonProps> = ({ title, label, tooltipProps, ...iconButonProps }) => {
    const WrappedButton = (
      <IconButton {...iconButonProps}>
        <WrappedIcon fontSize="inherit" />
        {label}
      </IconButton>
    )
    if (title || (tooltipProps && tooltipProps.title)) {
      return (
        <Tooltip title={title} {...tooltipProps}>
          {WrappedButton}
        </Tooltip>
      )
    }
    return WrappedButton
  }

  WithIconButton.displayName = `WithIconButton(${WrappedIcon.displayName})`
  return WithIconButton
}

export default withIconButton
