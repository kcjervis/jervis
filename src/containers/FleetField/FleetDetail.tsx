import { FleetRole, IFleet } from 'kc-calculator'
import { IPlane } from 'kc-calculator/dist/objects'
import { observable } from 'mobx'
import { observer } from 'mobx-react-lite'
import React, { createContext, useContext } from 'react'

import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import Typography from '@material-ui/core/Typography'

import ContactTable from './ContactTable'
import DayCombatCutinTable from './DayCombatCutinTable'
import NightBattleSpecialAttackTable from './NightBattleSpecialAttackTable'

interface IFleetDetailProps {
  fleet: IFleet
  fleetRole: FleetRole

  isCombinedFleet?: boolean
  combinedFleetPlanes?: IPlane[]
}

const FleetDetailContext = createContext(observable({ activeTab: 0 }))

const FleetDetail: React.FC<IFleetDetailProps> = props => {
  const fleetDetailStore = useContext(FleetDetailContext)
  const handleChangeTab = (event: React.ChangeEvent<{}>, next: number) => {
    fleetDetailStore.activeTab = next
  }

  const { fleet, fleetRole, isCombinedFleet, combinedFleetPlanes } = props
  const { activeTab } = fleetDetailStore
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Tabs value={fleetDetailStore.activeTab} onChange={handleChangeTab}>
          <Tab label="弾着&戦爆発動率" />
          <Tab label="触接率" />
          <Tab label="夜戦CI" />
        </Tabs>
      </div>

      {activeTab === 0 && <DayCombatCutinTable fleet={fleet} fleetRole={fleetRole} />}
      {activeTab === 1 && (
        <>
          {fleetRole !== FleetRole.EscortFleet && (
            <>
              <Typography variant="subtitle2">通常戦時</Typography>
              <ContactTable planes={fleet.planes} />
            </>
          )}
          {isCombinedFleet && combinedFleetPlanes && (
            <>
              <Typography variant="subtitle2">連合戦時</Typography>
              <ContactTable planes={combinedFleetPlanes} />
            </>
          )}
        </>
      )}
      {activeTab === 2 && <NightBattleSpecialAttackTable fleet={fleet} />}
    </div>
  )
}

export default observer(FleetDetail)
