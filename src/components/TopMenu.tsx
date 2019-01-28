import React, { useCallback, useRef } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'

import AppBar from '@material-ui/core/AppBar'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'

const styles = (theme: Theme) =>
  createStyles({
    appBar: {
      backgroundColor: theme.palette.primary.dark
    }
  })

export interface ITopMenuProps extends WithStyles<typeof styles>, RouteComponentProps<{}> {}

const TopMenu: React.FC<ITopMenuProps> = props => {
  const {
    location: { pathname },
    classes
  } = props
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
export default withStyles(styles)(withRouter(TopMenu))
