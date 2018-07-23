import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

const styles = theme => ({
  root: {}
})

const TopMenu = props => {
  const { pathname, history, classes } = props
  const paths = [
    { label: 'Home', path: '/home' },
    { label: '編成', path: '/operations' },
    { label: '艦娘', path: '/ships' },
    { label: '装備', path: '/equipments' }
  ]
  const isActive = paths.some(({ path }) => path === pathname)
  return (
    <div>
      <AppBar position="static">
        <Tabs
          value={isActive && pathname}
          onChange={(event, value) => history.push(value)}
          fullWidth
          indicatorColor="primary"
        >
          {paths.map(({ label, path }) => (
            <Tab key={path} label={label} value={path} />
          ))}
        </Tabs>
      </AppBar>
    </div>
  )
}

TopMenu.propTypes = {
  pathname: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
}

const mapStateToProps = ({ routerReducer }) => ({
  pathname: routerReducer.location.pathname,
  routerReducer
})

const mapDispatchToProps = dispatch => ({})

export default compose(
  withStyles(styles),
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(TopMenu)
