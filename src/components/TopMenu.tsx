import React from 'react'
import useReactRouter from 'use-react-router'

import AppBar from '@material-ui/core/AppBar'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme: Theme) => ({
  appBar: {
    backgroundColor: theme.palette.primary.dark
  }
}))

const TopMenu: React.FC = props => {
  const classes = useStyles()
  const {
    location: { pathname }
  } = useReactRouter()
  const paths = [
    { label: '編成', path: '/operations' },
    { label: '艦娘', path: '/ships' },
    { label: '装備', path: '/equipments' },
    { label: '海域', path: '/maps' },
    { label: 'Apps', path: '/apps' }
  ]
  const isActive = paths.some(({ path }) => path === pathname)
  return (
    <div>
      <AppBar className={classes.appBar} position="static">
        <Tabs value={isActive && pathname} variant="fullWidth" indicatorColor="primary">
          {paths.map(({ label, path }) => (
            <Tab key={path} href={`#${path}`} label={label} value={path} />
          ))}
        </Tabs>
      </AppBar>
    </div>
  )
}
export default TopMenu
