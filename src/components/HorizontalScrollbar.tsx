import React, { useRef } from 'react'
import Scrollbars, { ScrollbarProps } from 'react-custom-scrollbars'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    scrollbarTrack: {
      right: 2,
      bottom: 0,
      left: 2,
      borderRadius: 3
    },
    scrollbarThumb: {
      cursor: 'pointer',
      borderRadius: 'inherit',
      background: theme.palette.grey[300],
      opacity: 0.2
    }
  })
)

const HorizontalScrollbar: React.FC<ScrollbarProps> = props => {
  const classes = useStyles()
  const scrollRef = useRef<Scrollbars>(null)

  const handleWheel = (event: React.WheelEvent<Scrollbars>) => {
    if (scrollRef.current) {
      const { scrollLeft, getScrollLeft } = scrollRef.current
      scrollLeft(getScrollLeft() + event.deltaY)
    }
  }

  return (
    <Scrollbars
      onWheel={handleWheel}
      ref={scrollRef}
      renderTrackHorizontal={props => <div {...props} className={classes.scrollbarTrack} />}
      renderThumbHorizontal={props => <div {...props} className={classes.scrollbarThumb} />}
      {...props}
    />
  )
}

export default HorizontalScrollbar
