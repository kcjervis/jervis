import { MuiThemeProvider } from '@material-ui/core/styles'
import React, { Component } from 'react'
import { DragDropContext, DndProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { HashRouter, Route } from 'react-router-dom'

import { Provider as MobXProvider } from 'mobx-react'
import stores from './stores'

import Background from './Background'

import MapsPanel from './containers/MapsPanel'
import { ShipSelectPanel, Dialogs, Home, SettingPanel } from './containers'

import OperationPage from './containers/OperationPage'
import OperationsPage from './containers/OperationsPage'

import AppsPage from './containers/AppsPage'
import DataLoader from './containers/DataLoader'
import EquipmentsDataTable from './containers/EquipmentsDataTable'

import UrlShortener from './containers/UrlShortener'

import theme from './theme'
import Workspace from './containers/Workspace/Workspace'

export default class App extends Component {
  public render() {
    return (
      <MobXProvider {...stores}>
        <DndProvider backend={HTML5Backend}>
          <MuiThemeProvider theme={theme}>
            <Background />
            <HashRouter>
              <DataLoader>
                <Dialogs />
                <Workspace>
                  <Route exact={true} path="/" component={OperationsPage} />
                  <Route exact={true} path="/operations" component={OperationsPage} />
                  <Route exact={true} path="/ships" component={ShipSelectPanel} />
                  <Route exact={true} path="/equipments" component={EquipmentsDataTable} />
                  <Route exact={true} path="/maps" component={MapsPanel} />

                  <Route exact={true} path="/apps" component={AppsPage} />
                  <Route exact={true} path="/url-shortener" component={UrlShortener} />

                  <Route exact={true} path="/setting" component={SettingPanel} />
                </Workspace>
              </DataLoader>
            </HashRouter>
          </MuiThemeProvider>
        </DndProvider>
      </MobXProvider>
    )
  }
}
