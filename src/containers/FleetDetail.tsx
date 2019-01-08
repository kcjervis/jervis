import { AirControlState, ArtillerySpotting, FleetRole, IFleet } from 'kc-calculator'
import { observer } from 'mobx-react'
import React from 'react'

import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import Typography from '@material-ui/core/Typography'
import FleetAircraftCarrierCutinTable from './FleetAircraftCarrierCutinTable'
import FleetArtillerySpottingTable from './FleetArtillerySpottingTable'

interface IFleetDetailProps {
  fleet: IFleet
  fleetRole: FleetRole
}

@observer
class FleetDetail extends React.Component<IFleetDetailProps> {
  public state = { activeTab: 0, isAirSupremacy: true }

  public handleChangeTab = (event: React.ChangeEvent<{}>, activeTab: number) => {
    this.setState({ activeTab })
  }

  public handleChangeAirState = (event: React.ChangeEvent<HTMLInputElement>, isAirSupremacy: boolean) => {
    this.setState({ isAirSupremacy })
  }

  public render() {
    const { fleet, fleetRole } = this.props
    const { activeTab } = this.state

    const fleetLosModifier = ArtillerySpotting.calculateFleetLosModifier(fleet)
    const airControlState = this.state.isAirSupremacy ? AirControlState.AirSupremacy : AirControlState.AirSuperiority

    const dayCutinProps = { fleet, fleetRole, fleetLosModifier, airControlState }

    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Typography>艦隊索敵補正: {fleetLosModifier}</Typography>
          <FormControlLabel
            style={{ marginLeft: 8 }}
            control={<Switch onChange={this.handleChangeAirState} checked={this.state.isAirSupremacy} />}
            label={airControlState.name}
          />
          <Tabs value={this.state.activeTab} onChange={this.handleChangeTab}>
            <Tab label="弾着発動率" />
            <Tab label="戦爆連合発動率" />
          </Tabs>
        </div>

        {activeTab === 0 && <FleetArtillerySpottingTable {...dayCutinProps} />}
        {activeTab === 1 && <FleetAircraftCarrierCutinTable {...dayCutinProps} />}
      </div>
    )
  }
}

export default FleetDetail
