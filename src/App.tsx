import { ThemeProvider } from '@material-ui/styles'
import React, { Component } from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { HashRouter, Route } from 'react-router-dom'

import { Provider as MobXProvider } from 'mobx-react'
import stores from './stores'

import Background from './Background'

import MapsPage from './containers/MapsPage'
import { ShipSelectPanel } from './containers'

import OperationPage from './containers/OperationPage'
import OperationsPage from './containers/OperationsPage'

import AppsPage from './containers/AppsPage'
import DataLoader from './containers/DataLoader'
import EquipmentsDataTable from './containers/EquipmentsDataTable'

import UrlShortener from './containers/UrlShortener'

import theme from './theme'
import Workspace from './containers/Workspace/Workspace'

@DragDropContext(HTML5Backend)
export default class App extends Component {
  public render() {
    return (
      <MobXProvider {...stores}>
        <ThemeProvider theme={theme}>
          <Background />
          <HashRouter>
            <DataLoader>
              <Workspace>
                <Route exact={true} path="/" component={OperationsPage} />
                <Route path="/operations" component={OperationsPage} />

                <Route path="/operation" component={OperationPage} />
                <Route path="/ships" component={ShipSelectPanel} />
                <Route exact={true} path="/equipments" component={EquipmentsDataTable} />
                <Route path="/maps/:operationId" component={MapsPage} />
                <Route exact={true} path="/maps" component={MapsPage} />

                <Route exact={true} path="/apps" component={AppsPage} />
                <Route exact={true} path="/url-shortener" component={UrlShortener} />
              </Workspace>
            </DataLoader>
          </HashRouter>
        </ThemeProvider>
      </MobXProvider>
    )
  }
}
