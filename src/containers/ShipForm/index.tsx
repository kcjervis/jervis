import { observer } from 'mobx-react-lite'
import React, { useContext } from 'react'

import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import Input from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'
import Typography from '@material-ui/core/Typography'
import Add from '@material-ui/icons/Add'
import { makeStyles } from '@material-ui/styles'

import { RemoveButton, UpdateButton } from '../../components/IconButtons'
import { ShipImage } from '../../components'
import withDragAndDrop from '../../hocs/withDragAndDrop'
import EquipmentField from '../EquipmentField'

import ShipStatsExpansionPanel from './ShipStatsExpansionPanel'

import { ObservableFleet, ObservableShip, OperationStoreContext, SettingStoreContext } from '../../stores'
import ShipCalculator from '../ShipCalculator'

const useStyles = makeStyles({
  root: {
    margin: 4
  },
  addShipButton: {
    width: 8 * 31
  },
  card: {
    width: 8 * 31
  },
  top: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  shipImage: {
    display: 'flex',
    justifyContent: 'space-around'
  },
  equipments: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  equipment: {
    marginTop: 4
  }
})

interface ShipForm {
  ship?: ObservableShip
  fleet: ObservableFleet
  index: number
  onEndDrag: (drag: any, drop: any) => void
}

const ShipForm: React.FC<ShipForm> = props => {
  const { ship, fleet, index } = props
  const settingStore = useContext(SettingStoreContext)
  const operationStore = useContext(OperationStoreContext)
  const classes = useStyles()
  if (!ship) {
    return (
      <div className={classes.root}>
        <Button
          className={classes.addShipButton}
          href={`#/ships/${fleet.id}/${index}`}
          variant="outlined"
          fullWidth={true}
          size="large"
        >
          <Add />
          艦娘{index + 1}
        </Button>
      </div>
    )
  }
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    ship.level = Number(event.target.value)
    ship.nowHp = ship.asKcObject.health.maxHp
  }

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <div className={classes.top}>
          <Typography variant="caption">
            {index + 1} ID:{ship.masterId} {ship.asKcObject.name}
          </Typography>
          <div style={{ alignItems: 'right' }}>
            <UpdateButton title="艦娘を変更" size="small" href={`#/ships/${fleet.id}/${index}`} />
            <RemoveButton title="艦娘を削除" size="small" onClick={ship.remove} />
          </div>
        </div>

        <div className={classes.shipImage}>
          <ShipImage masterId={ship.masterId} imageType="banner" />
          <Input
            style={{ width: 70 }}
            startAdornment={<InputAdornment position="start">Lv</InputAdornment>}
            value={ship.level}
            type="number"
            disableUnderline={true}
            onChange={handleChange}
            inputProps={{ min: 1 }}
          />
        </div>

        <ShipStatsExpansionPanel ship={ship} open={settingStore.operationPage.visibleShipStats} />

        <div className={classes.equipments}>
          {ship.equipments.map((equip, index) => (
            <EquipmentField
              key={index}
              className={classes.equipment}
              onEndDrag={operationStore.switchEquipment}
              parent={ship}
              index={index}
              equipment={equip}
            />
          ))}
        </div>
      </Card>
    </div>
  )
}

export default withDragAndDrop('ShipForm')(observer(ShipForm))
