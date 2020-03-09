import { FleetRole, IFleet, IOperation, IPlane, Formation } from "kc-calculator"
import { observable } from "mobx"
import { observer } from "mobx-react"
import React, { createContext, useContext } from "react"

import Tab from "@material-ui/core/Tab"
import Tabs from "@material-ui/core/Tabs"
import Typography from "@material-ui/core/Typography"
import Paper from "@material-ui/core/Paper"

import ContactTable from "./ContactTable"
import NightCombatSpecialAttackTable from "./NightCombatSpecialAttackTable"
import AerialCombatTable from "./AerialCombatTable"
import { useBaseStyles } from "../../hooks"
import ShellingAttackTable from "./ShellingAttackTable"
import { floor } from "lodash-es"
import { toPercent } from "../../utils"

interface FleetDetailProps {
  operation: IOperation

  fleet: IFleet
  fleetRole: FleetRole

  tp: number

  isCombinedFleet?: boolean
  combinedFleetPlanes?: IPlane[]
  defaultFormation?: Formation
}

const FleetDetailContext = createContext(observable({ activeTab: 0 }))

const FleetDetail: React.FC<FleetDetailProps> = props => {
  const classes = useBaseStyles()
  const fleetDetailStore = useContext(FleetDetailContext)
  const handleChangeTab = (event: React.ChangeEvent<{}>, next: number) => {
    fleetDetailStore.activeTab = next
  }

  const { operation, fleet, fleetRole, tp, isCombinedFleet, combinedFleetPlanes, defaultFormation } = props
  const { activeTab } = fleetDetailStore

  return (
    <Paper style={{ padding: 8, maxWidth: 8 * 125, minWidth: 8 * 80, minHeight: 8 * 35 }}>
      <div className={classes.flexbox}>
        <Tabs value={fleetDetailStore.activeTab} onChange={handleChangeTab}>
          <Tab label="弾着&戦爆発動率" />
          <Tab label="触接率" />
          <Tab label="夜戦CI" />
          <Tab label="航空戦" />
          <Tab label="その他" />
        </Tabs>
      </div>

      {activeTab === 0 && <ShellingAttackTable fleet={fleet} fleetRole={fleetRole} />}
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
      {activeTab === 2 && <NightCombatSpecialAttackTable fleet={fleet} />}
      {activeTab === 3 && (
        <AerialCombatTable
          operation={operation}
          fleet={fleet}
          isCombinedFleet={isCombinedFleet}
          fleetRole={fleetRole}
          defaultFormation={defaultFormation}
        />
      )}
      {activeTab === 4 && (
        <>
          <Typography>TP(S勝利): {tp}</Typography>
          <Typography>TP(A勝利): {Math.floor(tp * 0.7)}</Typography>
          <Typography>遠征ボーナス: +{toPercent(fleet.expeditionBonus)}</Typography>
          <Typography>航空索敵スコア: {floor(fleet.aviationDetectionScore, 2)}</Typography>
        </>
      )}
    </Paper>
  )
}

export default observer(FleetDetail)
