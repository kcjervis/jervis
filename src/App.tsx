import { ThemeProvider } from '@material-ui/styles'
import React, { Component } from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { HashRouter, Route } from 'react-router-dom'

import { Provider as MobXProvider } from 'mobx-react'
import stores from './stores'

import Background from './Background'
import TopMenu from './components/TopMenu'

import MapsPage from './containers/MapsPage'

import MasterShipsPage from './containers/MasterShipsPage'
import OperationPage from './containers/OperationPage'
import OperationsPage from './containers/OperationsPage'

import AppsPage from './containers/AppsPage'
import DataLoader from './containers/DataLoader'
import EquipmentsDataTable from './containers/EquipmentsDataTable'
import UrlShortener from './containers/UrlShortener'

import theme from './theme'

@DragDropContext(HTML5Backend)
export default class App extends Component {
  public render() {
    return (
      <MobXProvider {...stores}>
        <ThemeProvider theme={theme}>
          <Background />
          <HashRouter>
            <DataLoader>
              <TopMenu />
              <Route exact={true} path="/" component={OperationsPage} />
              <Route exact={true} path="/operations" component={OperationsPage} />
              <Route exact={true} path="/operation" component={OperationPage} />
              <Route path="/operation/:json" component={OperationPage} />
              <Route path="/ships/:fleetId/:index" component={MasterShipsPage} />
              <Route exact={true} path="/ships" component={MasterShipsPage} />
              <Route exact={true} path="/equipments" component={EquipmentsDataTable} />
              <Route path="/maps/:operationId" component={MapsPage} />
              <Route exact={true} path="/maps" component={MapsPage} />

              <Route exact={true} path="/apps" component={AppsPage} />
              <Route exact={true} path="/url-shortener" component={UrlShortener} />
            </DataLoader>
          </HashRouter>
        </ThemeProvider>
      </MobXProvider>
    )
  }
}
