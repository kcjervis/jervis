import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { Route } from 'react-router'
import { ConnectedRouter } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

import configureStore from './redux/configureStore'
import TopMenu from './containers/TopMenu'
import Home from './containers/home'
import Operations from './containers/Operations'
import OperationPage from './containers/OperationPage'
import ShipsPage from './containers/ShipsPage'
import EquipmentsPage from './containers/EquipmentsPage'
import Test from './containers/test'

import pink from '@material-ui/core/colors/pink'
import blue from '@material-ui/core/colors/blue'

const history = createHistory()
const store = configureStore(history)

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    background: {
      paper: 'rgba( 255, 255, 255, 0.1 )'
    }
  },
  overrides: {
    MuiTab: {
      textColorInherit: {
        color: 'rgba( 250, 250, 250, 0.7 )',
        '&$selected': {
          color: 'rgba( 255, 255, 255, 1 )',
          textShadow: '0 0 10px #fff,0 0 15px #fff'
        }
      }
    }
  }
})

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <MuiThemeProvider theme={theme}>
          <ConnectedRouter history={history}>
            <div>
              <TopMenu />
              <div style={{ margin: 20 }}>
                <Route exact path="/" component={Home} />
                <Route exact path="/operations" component={Operations} />
                <Route path="/operation" component={OperationPage} />
                <Route path="/ships" component={ShipsPage} />
                <Route path="/equipments" component={EquipmentsPage} />
                <Route path="/test" component={Test} />
              </div>
            </div>
          </ConnectedRouter>
        </MuiThemeProvider>
      </Provider>
    )
  }
}

export default DragDropContext(HTML5Backend)(App)
