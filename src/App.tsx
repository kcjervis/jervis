import { MuiThemeProvider } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import React, { Component, useEffect, useState } from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { HashRouter, Route } from 'react-router-dom'

import { Provider as MobXProvider } from 'mobx-react'
import stores, { loadStores } from './stores'

import Background from './Background'
import TopMenu from './components/TopMenu'

import EquipmentsPage from './containers/EquipmentsPage'
import MapsPage from './containers/MapsPage'

import MasterShipsPage from './containers/MasterShipsPage'
import OperationPage from './containers/OperationPage'
import OperationsPage from './containers/OperationsPage'

import AppsPage from './containers/AppsPage'
import EquipmentsDataTable from './containers/EquipmentsDataTable'
import UrlShortener from './containers/UrlShortener'

import theme from './theme'

const AppSuspense: React.FC = ({ children }) => {
  const [isReady, setIsReady] = useState(false)
  useEffect(() => {
    const load = async () => {
      await loadStores()
      setIsReady(true)
    }
    load()
  }, [setIsReady])
  if (!isReady) {
    return <div>loading</div>
  }
  return <>{children}</>
}

@DragDropContext(HTML5Backend)
export default class App extends Component {
  public render() {
    return (
      <MobXProvider {...stores}>
        <MuiThemeProvider theme={theme}>
          <ThemeProvider theme={theme}>
            <Background />
            <HashRouter>
              <AppSuspense>
                <TopMenu />
                <Route exact={true} path="/" component={OperationsPage} />
                <Route exact={true} path="/operations" component={OperationsPage} />
                <Route exact={true} path="/operation" component={OperationPage} />
                <Route path="/ships/:fleetId/:index" component={MasterShipsPage} />
                <Route exact={true} path="/ships" component={MasterShipsPage} />
                <Route exact={true} path="/equipments" component={EquipmentsDataTable} />
                <Route path="/maps/:operationId" component={MapsPage} />
                <Route exact={true} path="/maps" component={MapsPage} />

                <Route exact={true} path="/apps" component={AppsPage} />
                <Route exact={true} path="/url-shortener" component={UrlShortener} />
              </AppSuspense>
            </HashRouter>
          </ThemeProvider>
        </MuiThemeProvider>
      </MobXProvider>
    )
  }
}
