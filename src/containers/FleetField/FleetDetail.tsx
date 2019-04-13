import { FleetRole, IFleet, BattleType } from 'kc-calculator'
import { IPlane } from 'kc-calculator/dist/objects'
import { observable } from 'mobx'
import { observer } from 'mobx-react-lite'
import React, { createContext, useContext } from 'react'

import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'

import ContactTable from './ContactTable'
import DayCombatCutinTable from './DayCombatCutinTable'
import NightBattleSpecialAttackTable from './NightBattleSpecialAttackTable'
import AerialCombatTable from './AerialCombatTable'
import { useBaseStyles } from '../../hooks'

interface FleetDetailProps {
  fleet: IFleet
  fleetRole: FleetRole

  isCombinedFleet?: boolean
  combinedFleetPlanes?: IPlane[]
}

const FleetDetailContext = createContext(observable({ activeTab: 0 }))

const FleetDetail: React.FC<FleetDetailProps> = props => {
  const classes = useBaseStyles()
  const fleetDetailStore = useContext(FleetDetailContext)
  const handleChangeTab = (event: React.ChangeEvent<{}>, next: number) => {
    fleetDetailStore.activeTab = next
  }

  const { fleet, fleetRole, isCombinedFleet, combinedFleetPlanes } = props
  const { activeTab } = fleetDetailStore

  return (
    <Paper style={{ padding: 8, minHeight: 8 * 35, width: 800, alignSelf: 'center' }}>
      <div className={classes.flexbox}>
        <Tabs value={fleetDetailStore.activeTab} onChange={handleChangeTab}>
          <Tab label="弾着&戦爆発動率" />
          <Tab label="触接率" />
          <Tab label="夜戦CI" />
          <Tab label="航空戦" />
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
      {activeTab === 3 && <AerialCombatTable fleet={fleet} isCombinedFleet={isCombinedFleet} fleetRole={fleetRole} />}
    </Paper>
  )
}

export default observer(FleetDetail)
