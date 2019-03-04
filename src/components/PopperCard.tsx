import React from 'react'
import Draggable from 'react-draggable'

import Card from '@material-ui/core/Card'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Fade from '@material-ui/core/Fade'
import Popper from '@material-ui/core/Popper'

interface PopperCardProps {
  open: boolean
  anchorEl: null | HTMLElement
  onClickAway: (event: React.ChangeEvent<{}>) => void
  className?: string
  style?: React.CSSProperties
}

const PopperCard: React.FC<PopperCardProps> = ({ open, anchorEl, onClickAway, children, className, style }) => (
  <Popper className={className} style={style} open={open} anchorEl={anchorEl} transition={true}>
    {({ TransitionProps }) => (
      <ClickAwayListener onClickAway={onClickAway}>
        <Draggable>
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
