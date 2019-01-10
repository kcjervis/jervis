import { AirControlState, ArtillerySpotting, FleetRole, IFleet } from 'kc-calculator'
import { IPlane } from 'kc-calculator/dist/objects'
import { observer } from 'mobx-react'
import React from 'react'

import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import Typography from '@material-ui/core/Typography'

import ContactTable from './ContactTable'
import DayCombatCutinTable from './DayCombatCutinTable'

interface IFleetDetailProps {
  fleet: IFleet
  fleetRole: FleetRole

  isCombinedFleet?: boolean
  combinedFleetPlanes?: IPlane[]
}

@observer
class FleetDetail extends React.Component<IFleetDetailProps> {
  public state = { activeTab: 0 }

  public handleChangeTab = (event: React.ChangeEvent<{}>, activeTab: number) => {
    this.setState({ activeTab })
  }
  public render() {
    const { fleet, fleetRole, isCombinedFleet, combinedFleetPlanes } = this.props
    const { activeTab } = this.state

    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Tabs value={this.state.activeTab} onChange={this.handleChangeTab}>
            <Tab label="弾着&戦爆発動率" />
            <Tab label="触接率" />
          </Tabs>
        </div>

        {activeTab === 0 && <DayCombatCutinTable fleet={fleet} fleetRole={fleetRole} />}
        {activeTab === 1 && (
          <div>
            {fleetRole !== FleetRole.EscortFleet && (
              <div>
                <Typography variant="subtitle2">通常戦時</Typography>
                <ContactTable planes={fleet.planes} />
              </div>
            )}
            {isCombinedFleet && combinedFleetPlanes && (
              <div>
                <Typography variant="subtitle2">連合戦時</Typography>
                <ContactTable planes={combinedFleetPlanes} />
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
}

export default FleetDetail
