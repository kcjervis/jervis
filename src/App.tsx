import { MuiThemeProvider } from "@material-ui/core/styles"
import React from "react"
import { DndProvider } from "react-dnd"
import HTML5Backend from "react-dnd-html5-backend"
import { HashRouter, Route } from "react-router-dom"

import { Provider as MobXProvider } from "mobx-react"
import stores from "./stores"

import Box from "@material-ui/core/Box"

import Background from "./Background"

import { ShipSelectPanel, Dialogs, SettingPanel, SeamapPanel } from "./containers"
import { HomePage, HelpPage } from "./components"

import OperationsPage from "./containers/OperationsPage"

import AppsPage from "./containers/AppsPage"
import DataLoader from "./containers/DataLoader"
import GearsDataTable from "./containers/GearsDataTable"

import UrlShortener from "./containers/UrlShortener"

import theme from "./theme"
import Workspace from "./containers/Workspace/Workspace"
import Transfer from "./Transfer"

const App: React.FC = () => {
  return (
    <MobXProvider {...stores}>
      <DndProvider backend={HTML5Backend}>
        <MuiThemeProvider theme={theme}>
          <Background />
          <HashRouter>
            <DataLoader>
              <Dialogs />
              <Workspace>
                <Route exact={true} path="/" component={HomePage} />
                <Route exact={true} path="/operations" component={OperationsPage} />
                <Route exact={true} path="/ships" component={ShipSelectPanel} />
                <Route exact={true} path="/equipments" component={GearsDataTable} />
                <Route exact={true} path="/maps" component={SeamapPanel} />
                <Route exact={true} path="/help" component={HelpPage} />

                <Route exact={true} path="/apps" component={AppsPage} />
                <Route exact={true} path="/url-shortener" component={UrlShortener} />

                <Route exact={true} path="/cup4" component={SettingPanel} />
                <Route exact={true} path="/transfer" component={Transfer} />

                <Box minHeight={320} />
              </Workspace>
            </DataLoader>
          </HashRouter>
        </MuiThemeProvider>
      </DndProvider>
    </MobXProvider>
  )
}

export default App
