import { inject, observer } from 'mobx-react'
import React from 'react'

import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Input from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Add from '@material-ui/icons/Add'

import { RemoveButton } from '../components/IconButtons'
import ShipImage from '../components/ShipImage'
import withDragAndDrop from '../hocs/withDragAndDrop'
import EquipmentField from './EquipmentField'
import ShipStatControl from './ShipStatControl'

import stores from '../stores'
import ObservableShip from '../stores/ObservableShip'

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

const styles = createStyles({
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
  addShipButton: {
    width: 280,
    height: 360
  },
  equipments: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  flexContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap'
  }
})

interface IShipField extends WithStyles<typeof styles> {
  ship?: ObservableShip
  fleetId: string
  index: number
  onEndDrag: (drag: any, drop: any) => void
}
const ShipField: React.SFC<IShipField> = props => {
  const { ship, classes, fleetId, index } = props
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
  }

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <div className={classes.top}>
          <Typography variant="caption">
            {index + 1} ID:{ship.masterId} {ship.asKcObject.name}
          </Typography>
          <div style={{ alignItems: 'right' }}>
            <RemoveButton size="small" style={{ padding: 4 }} onClick={ship.remove} />
          </div>
        </div>

        <CardContent>
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
        </CardContent>

        {/* 艦娘ステータス */
        stores.settingStore.operationPage.visibleShipStats && (
          <div className={classes.flexContainer}>
            {shipStatNames.map(statName => (
              <ShipStatControl key={statName} statName={statName} ship={ship} />
            ))}
          </div>
        )}

        <div className={classes.equipments}>
          {ship.equipments.map((equip, equipIndex) => (
            <EquipmentField key={equipIndex} parent={ship} index={equipIndex} equipment={equip} />
          ))}
        </div>
      </Card>
    </div>
  )
}

const mapStateToProps = () => ({
  onEndDrag: stores.operationStore.switchShip
})
const Injected = inject(mapStateToProps)(observer(ShipField))
export default withDragAndDrop('ShipField')(withStyles(styles)(Injected))
