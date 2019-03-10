import React from 'react'
import Draggable from 'react-draggable'

import Card from '@material-ui/core/Card'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Fade from '@material-ui/core/Fade'
import Popper, { PopperProps } from '@material-ui/core/Popper'

interface PopperCardProps extends PopperProps {
  onClickAway: (event: React.ChangeEvent<{}>) => void
  draggable?: boolean
}

const PopperCard: React.FC<PopperCardProps> = ({ children, onClickAway, draggable = true, ...popperProps }) => (
  <Popper transition={true} {...popperProps}>
    {({ TransitionProps }) => (
      <ClickAwayListener onClickAway={onClickAway}>
        <Draggable disabled={!draggable}>
          <Fade {...TransitionProps} timeout={150}>
            <Card elevation={12} style={{ background: 'rgba(0, 0, 0, 0.9)' }}>
              {children}
            </Card>
          </Fade>
        </Draggable>
      </ClickAwayListener>
    )}
  </Popper>
)

export default PopperCard
