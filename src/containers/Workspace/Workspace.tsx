import React, { useContext } from 'react'
import classNames from 'classnames'
import { observer } from 'mobx-react-lite'

import Button from '@material-ui/core/Button'
import FolderIcon from '@material-ui/icons/Folder'
import Drawer from '@material-ui/core/Drawer'
import { makeStyles, createStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core'

import Explorer from '../Explorer'

import { useOpen } from '../../hooks'
import { WorkspaceStoreContext } from '../../stores'
import WorkspaceBar from './WorkspaceBar'
import WorkspaceTabPanel from './WorkspaceTabPanel'
import withIconButton from '../../hocs/withIconButton'

const FolderButton = withIconButton(FolderIcon)

const workspaceBarHeight = 32
const drawerWidth = 8 * 30

const useStyles = makeStyles((theme: Theme) => {
  const { grey } = theme.palette
  return createStyles({
    drawer: {
      width: drawerWidth,
      background: grey[900]
    },
    workspaceBar: {
      background: grey[900]
    },
    workspaceBarShift: {
      width: `calc(100vw - ${drawerWidth}px)`
    },
    content: {
      marginTop: workspaceBarHeight,
      height: `calc(100vh - ${workspaceBarHeight}px)`,
      overflow: 'auto',
      scrollbarColor: `${grey[700]} ${grey[900]}`,
      scrollbarWidth: 'thin',
      '&::-webkit-scrollbar': {
        width: 8
      },
      '&::-webkit-scrollbar-track': {
        background: grey[900],
        borderLeft: `solid 1px ${grey[700]}`
      },
      '&::-webkit-scrollbar-thumb': {
        background: grey[700]
      }
      // transition: theme.transitions.create('margin', {
      //   easing: theme.transitions.easing.sharp,
      //   duration: theme.transitions.duration.leavingScreen
      // })
    },
    contentShift: {
      // transition: theme.transitions.create('margin', {
      //   easing: theme.transitions.easing.easeOut,
      //   duration: theme.transitions.duration.enteringScreen
      // }),
      marginLeft: drawerWidth
    }
  })
})

const Workspace: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const classes = useStyles()
  const { open, onOpen, onClose } = useOpen()
  const store = useContext(WorkspaceStoreContext)
  const { activeItem } = store
  return (
    <>
      <Drawer variant="persistent" open={open} className={classes.drawer} classes={{ paper: classes.drawer }}>
        <Explorer onClose={onClose} workspaceStore={store} />
      </Drawer>
      <WorkspaceBar
        workspaceStore={store}
        className={classNames(classes.workspaceBar, open && classes.workspaceBarShift)}
        position="fixed"
      >
        <FolderButton title="編成一覧" size="small" color="primary" onClick={onOpen} />
      </WorkspaceBar>
      <div className={classNames(classes.content, open && classes.contentShift)}>
        {children}
        {/* {activeItem && <WorkspaceTabPanel item={activeItem} />} */}
      </div>
    </>
  )
}

export default observer(Workspace)
