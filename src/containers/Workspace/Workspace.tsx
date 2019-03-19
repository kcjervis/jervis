import React, { useContext } from 'react'
import classNames from 'classnames'
import { observer } from 'mobx-react-lite'
import useReactRouter from 'use-react-router'

import grey from '@material-ui/core/colors/grey'
import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import Drawer from '@material-ui/core/Drawer'
import { makeStyles, createStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core'

import { useOpen } from '../../hooks'
import { OperationStoreContext } from '../../stores'
import WorkspaceTab from './WorkspaceTab'
import OperationsPage from '../OperationsPage'

const drawerWidth = 400

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      width: drawerWidth,
      background: grey[900]
    },
    appBar: {
      background: grey[900]
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`
    },
    content: {
      paddingTop: 40
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
)

const Workspace: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const classes = useStyles()
  const { open, onOpen, onClose } = useOpen()
  const { activeOperation, operations } = useContext(OperationStoreContext)
  const { history, location } = useReactRouter()
  const paths = [
    { label: '編成', path: '/operations' },
    { label: '艦娘', path: '/ships' },
    { label: '装備', path: '/equipments' },
    { label: '海域', path: '/maps' },
    { label: 'Apps', path: '/apps' }
  ]

  const handleOperationClick = () => {
    history.replace('/operation')
  }
  return (
    <>
      <Drawer variant="persistent" open={open} className={classes.drawer} classes={{ paper: classes.drawer }}>
        <Button onClick={onClose}>閉じる</Button>
      </Drawer>
      <AppBar className={classNames(classes.appBar, open && classes.appBarShift)} position="fixed">
        <div style={{ display: 'flex' }}>
          {activeOperation && (
            <WorkspaceTab
              name={activeOperation.name}
              active={location.pathname === '/operation'}
              onClick={handleOperationClick}
            />
          )}
          <div style={{ flexGrow: 1 }} />
          {paths.map(({ label, path }) => (
            <Button key={path} href={'#' + path}>
              {label}
            </Button>
          ))}
        </div>
      </AppBar>
      <div className={classNames(classes.content, open && classes.contentShift)}>{children}</div>
    </>
  )
}

export default observer(Workspace)
