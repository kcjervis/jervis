import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import React, { Component } from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { Provider } from 'react-redux'
import { Route } from 'react-router'
import { ConnectedRouter } from 'react-router-redux'

import createHistory from 'history/createBrowserHistory'
import TopMenu from './components/TopMenu'
import EquipmentsPage from './containers/EquipmentsPage'
import Home from './containers/home'
import MapsPage from './containers/MapsPage'
import OperationPage from './containers/OperationPage'
import Operations from './containers/Operations'
import ShipsPage from './containers/ShipsPage'

import configureStore from './redux/configureStore'

const history = createHistory()
const store = configureStore(history, {})

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

@DragDropContext(HTML5Backend)
export default class App extends Component {
  public render() {
    return (
      <Provider store={store}>
        <MuiThemeProvider theme={theme}>
          <ConnectedRouter history={history}>
            <div>
              <TopMenu />
              <div style={{ margin: 20 }}>
                <Route exact={true} path="/" component={Home} />
                <Route exact={true} path="/operations" component={Operations} />
                <Route path="/operation" component={OperationPage} />
                <Route path="/ships" component={ShipsPage} />
                <Route path="/equipments" component={EquipmentsPage} />
                <Route path="/maps" component={MapsPage} />
              </div>
            </div>
          </ConnectedRouter>
        </MuiThemeProvider>
      </Provider>
    )
  }
}
