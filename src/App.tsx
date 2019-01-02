import { MuiThemeProvider } from '@material-ui/core/styles'
import React, { Component } from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { HashRouter, Route } from 'react-router-dom'

import { Provider as MobXProvider } from 'mobx-react'
import stores from './stores'

import TopMenu from './components/TopMenu'
import EquipmentsPage from './containers/EquipmentsPage'
import MapsPage from './containers/MapsPage'

import MasterShipsPage from './containers/MasterShipsPage'
import OperationPage from './containers/OperationPage'
import OperationsPage from './containers/OperationsPage'

import theme from './theme'

@DragDropContext(HTML5Backend)
export default class App extends Component {
  public render() {
    return (
      <MobXProvider {...stores}>
        <MuiThemeProvider theme={theme}>
          <HashRouter>
            <div>
              <TopMenu />
              <Route exact={true} path="/" component={OperationsPage} />
              <Route exact={true} path="/operations" component={OperationsPage} />
              <Route exact={true} path="/operation" component={OperationPage} />
              <Route path="/ships/:fleetId/:index" component={MasterShipsPage} />
              <Route exact={true} path="/ships" component={MasterShipsPage} />
              <Route path="/equipments/:type/:parentId/:index" component={EquipmentsPage} />
              <Route exact={true} path="/equipments" component={EquipmentsPage} />
              <Route path="/maps/:operationId" component={MapsPage} />
              <Route exact={true} path="/maps" component={MapsPage} />
            </div>
          </HashRouter>
        </MuiThemeProvider>
      </MobXProvider>
    )
  }
}
