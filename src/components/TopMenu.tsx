import AppBar from '@material-ui/core/AppBar'
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'

const styles = (theme: Theme) => ({
  root: {}
})

export interface ITopMenuProps extends WithStyles<typeof styles>, RouteComponentProps<{}> {}

const TopMenu: React.SFC<ITopMenuProps> = props => {
  const {
    history,
    location: { pathname },
    classes
  } = props
  const paths = [
    { label: '艦娘', path: '/ships' },
    { label: '装備', path: '/equipments' },
    { label: '海域', path: '/maps' }
  ]
  const isActive = paths.some(({ path }) => path === pathname)
  const handleChange = (_: React.ChangeEvent<{}>, path: string) => {
    history.push(path)
  }
  return (
    <div>
      <AppBar position="static">
        <Tabs value={isActive && pathname} onChange={handleChange} fullWidth={true} indicatorColor="primary">
          {paths.map(({ label, path }) => (
            <Tab key={path} label={label} value={path} />
          ))}
        </Tabs>
      </AppBar>
    </div>
  )
}

export default withStyles(styles)(withRouter(TopMenu))
