import { MuiThemeProvider } from '@material-ui/core/styles'
import React, { Component } from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { BrowserRouter, Route } from 'react-router-dom'

import { Provider as MobXProvider } from 'mobx-react'
import stores from './stores'

import TopMenu from './components/TopMenu'
import EquipmentsPage from './containers/EquipmentsPage'
import MapsPage from './containers/MapsPage'

import OperationPage from './containers/OperationPage'
import OperationsPage from './containers/OperationsPage'

import MasterShipsPage from './containers/MasterShipsPage'

import theme from './theme'

@DragDropContext(HTML5Backend)
export default class App extends Component {
  public render() {
    return (
      <MobXProvider {...stores}>
        <MuiThemeProvider theme={theme}>
          <BrowserRouter basename="/jervis">
            <div>
              <TopMenu />
              <Route exact={true} path="/" component={OperationsPage} />
              <Route exact={true} path="/operations" component={OperationsPage} />
              <Route path="/operation" component={OperationPage} />
              <Route path="/ships" component={MasterShipsPage} />
              <Route path="/equipments" component={EquipmentsPage} />
              <Route path="/maps" component={MapsPage} />
            </div>
          </BrowserRouter>
        </MuiThemeProvider>
      </MobXProvider>
    )
  }
}
