import React, { useRef } from 'react'
import { observer } from 'mobx-react-lite'
import Scrollbars from 'react-custom-scrollbars'

import AppBar, { AppBarProps } from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import { makeStyles, createStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core'

import WorkspaceTab from './WorkspaceTab'

import { WorkspaceStore } from '../../stores'

const appBarHeight = 32

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    bar: {
      display: 'flex',
      alignItems: 'center',
      height: appBarHeight
    },
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

type WorkspaceBarPorps = AppBarProps & { workspaceStore: WorkspaceStore }

const WorkspaceBar: React.FC<WorkspaceBarPorps> = ({ workspaceStore, children, ...appBarProps }) => {
  const classes = useStyles()

  const paths = [
    { label: '編成', path: '/operations' },
    { label: '艦娘', path: '/ships' },
    { label: '装備', path: '/equipments' },
    { label: '海域', path: '/maps' },
    { label: 'Apps', path: '/apps' }
  ]

  const scrollRef = useRef<Scrollbars>(null)
  const handleWheel = (event: React.WheelEvent<Scrollbars>) => {
    if (scrollRef.current) {
      const { scrollLeft, getScrollLeft } = scrollRef.current
      scrollLeft(getScrollLeft() + event.deltaY)
    }
  }

  return (
    <AppBar {...appBarProps}>
      <div className={classes.bar}>
        {children}
        <Scrollbars
          style={{ flexGrow: 1, width: 'auto' }}
          onWheel={handleWheel}
          ref={scrollRef}
          renderTrackHorizontal={props => <div {...props} className={classes.scrollbarTrack} />}
          renderThumbHorizontal={props => <div {...props} className={classes.scrollbarThumb} />}
        >
          <div className={classes.bar}>
            {workspaceStore.items.map(item => (
              <WorkspaceTab key={item.id} item={item} />
            ))}
          </div>
        </Scrollbars>

        {paths.map(({ label, path }) => (
          <Button key={path} href={'#' + path}>
            {label}
          </Button>
        ))}
      </div>
    </AppBar>
  )
}

export default observer(WorkspaceBar)
