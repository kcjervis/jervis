import { FleetType, Side } from 'kc-calculator'
import { inject, observer } from 'mobx-react'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import { Redirect } from 'react-router-dom'

import Checkbox from '@material-ui/core/Checkbox'
import Divider from '@material-ui/core/Divider'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Input from '@material-ui/core/Input'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import FleetTypeSelect from '../../components/FleetTypeSelect'

import stores, { ObservableOperation, SettingStore } from '../../stores'
import FleetField from '../FleetField'
import LandBaseForm from '../LandBaseForm'
import JsonDialog from './JsonDialog'

const styles = createStyles({
  name: { marginRight: 8 },
  hqLevel: { marginLeft: 8, marginRight: 8, width: 50 },
  tabs: { display: 'flex', flexWrap: 'wrap' },
  menu: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: 8
  },
  checkBoxForm: {
    margin: 8
  }
})

interface IOperationPageProps extends WithStyles<typeof styles>, RouteComponentProps<{}> {
  operation?: ObservableOperation
  settingStore?: SettingStore
}

const OperationPage: React.FC<IOperationPageProps> = ({ operation, history, classes, settingStore }) => {
  if (!operation) {
    return <Redirect to="operations" />
  }

  const setting = settingStore!

  const handleChange = (e: unknown, value: number) => {
    operation.activeFleetIndex = value
  }

  const handleFleetTypeChange = (fleetType: FleetType) => {
    operation.fleetType = fleetType
  }

  const handleSideChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target
    const side = checked ? Side.Enemy : Side.Player
    operation.side = side
  }

  const handleVisibleShipStatsChange = () => {
    const { operationPage } = setting
    operationPage.visibleShipStats = !operationPage.visibleShipStats
  }

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    operation.name = event.target.value
  }

  const handleHqLevelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    operation.hqLevel = Number(event.target.value)
  }

  const { activeFleetIndex } = operation
  const activeFleet = operation.activeFleet

  const { mainFleet, escortFleet } = operation.asKcObject
  let combinedFleetFighterPower = mainFleet.fighterPower
  let combinedFleetFighterPowerLabel = ''
  if (escortFleet) {
    combinedFleetFighterPower += escortFleet.fighterPower
    combinedFleetFighterPowerLabel = `連合戦制空: ${combinedFleetFighterPower}`
  }

  return (
    <div style={{ margin: 8 }}>
      <div className={classes.menu}>
        <Input className={classes.name} value={operation.name} onChange={handleChangeName} />
        <FleetTypeSelect fleetType={operation.fleetType} onChange={handleFleetTypeChange} />
        <Typography>司令部Lv</Typography>
        <TextField
          className={classes.hqLevel}
          type="number"
          inputProps={{ min: 1 }}
          value={operation.hqLevel}
          onChange={handleHqLevelChange}
        />
        <Typography style={{ margin: 8 }}>
          第一艦隊制空: {mainFleet.fighterPower} {combinedFleetFighterPowerLabel}
        </Typography>

        <FormControlLabel
          className={classes.checkBoxForm}
          control={
            <Checkbox checked={setting.operationPage.visibleShipStats} onChange={handleVisibleShipStatsChange} />
          }
          label={<Typography variant="caption">ステータス表示</Typography>}
        />
        <FormControlLabel
          className={classes.checkBoxForm}
          control={<Checkbox checked={operation.side === Side.Enemy} onChange={handleSideChange} />}
          label={<Typography variant="caption">敵艦隊</Typography>}
        />

        <JsonDialog json={operation.toNishikumaJson} />
      </div>

      <div className={classes.tabs}>
        <Tabs value={activeFleetIndex} onChange={handleChange}>
          {operation.fleets.map((fleet, index) => {
            if (operation.asKcObject.isCombinedFleetOperation && index < 2) {
              return <Tab key={`fleetTab${index}`} label={`連合第${index + 1}`} />
            }
            return <Tab key={`fleetTab${index}`} label={`${index + 1}`} />
          })}
          <Tab label="基地航空隊" />
        </Tabs>
      </div>

      <Divider />

      {activeFleet && <FleetField fleet={activeFleet} operation={operation} />}
      {!activeFleet && <LandBaseForm operation={operation} />}
    </div>
  )
}

const mapStateToProps = () => {
  const { activeOperation } = stores.operationStore
  if (!activeOperation) {
    return
  }
  const { settingStore } = stores
  return {
    operation: activeOperation,
    settingStore
  }
}

export default withStyles(styles)(inject(mapStateToProps)(observer(OperationPage)))
