import { observer } from 'mobx-react-lite'
import React from 'react'

import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid'
import Input from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'
import Typography from '@material-ui/core/Typography'
import Add from '@material-ui/icons/Add'

import { makeStyles } from '@material-ui/styles'

import { RemoveButton, UpdateButton } from '../../components/IconButtons'
import ShipImage from '../../components/ShipImage'
import withDragAndDrop from '../../hocs/withDragAndDrop'
import EquipmentExpansionPanel from '../EquipmentExpansionPanel'
import ShipStatDialog from './ShipStatDialog'

import stores, { ObservableShip } from '../../stores'
import HealthBarDialog from './HealthBarDialog'

type ShipStatName =
  | 'hp'
  | 'firepower'
  | 'armor'
  | 'torpedo'
  | 'evasion'
  | 'antiAir'
  | 'asw'
  | 'speed'
  | 'los'
  | 'range'
  | 'luck'

const shipStatNames: ShipStatName[] = [
  'hp',
  'firepower',
  'armor',
  'torpedo',
  'evasion',
  'antiAir',
  'asw',
  'speed',

  'los',
  'range',
  'luck'
]

const useStyles = makeStyles({
  root: {
    margin: 4
  },
  card: {
    width: 280
  },
  top: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  shipImage: {
    display: 'flex',
    justifyContent: 'space-around'
  },
  addShipButton: {
    width: 280
  },

  equipments: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  stats: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap'
  }
})

interface IShipForm {
  ship?: ObservableShip
  fleetId: string
  index: number
  onEndDrag: (drag: any, drop: any) => void
}

const ShipForm: React.FC<IShipForm> = props => {
  const { ship, fleetId, index } = props
  const classes = useStyles()
  if (!ship) {
    return (
      <div className={classes.root}>
        <Button
          className={classes.addShipButton}
          href={`#/ships/${fleetId}/${index}`}
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
            <UpdateButton size="small" style={{ padding: 4 }} href={`#/ships/${fleetId}/${index}`} />
            <RemoveButton size="small" style={{ padding: 4 }} onClick={ship.remove} />
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

        {/* 艦娘ステータス */
        stores.settingStore.operationPage.visibleShipStats && (
          <>
            <HealthBarDialog ship={ship} />

            <Grid container={true}>
              {shipStatNames.map(statName => (
                <Grid item={true} xs={6} key={statName}>
                  <ShipStatDialog statName={statName} ship={ship} />
                </Grid>
              ))}
            </Grid>
          </>
        )}

        <div className={classes.equipments}>
          <EquipmentExpansionPanel parent={ship} equipments={ship.equipments} />
        </div>
      </Card>
    </div>
  )
}

export default withDragAndDrop('ShipForm')(observer(ShipForm))
