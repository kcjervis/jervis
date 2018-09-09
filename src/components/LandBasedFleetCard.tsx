import React from 'react'

import Card from '@material-ui/core/Card'
import { StyleRulesCallback, withStyles, WithStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import EquipmentLabel from '../containers/EquipmentLabel'
import withDragAndDrop from '../hocs/withDragAndDrop'

const styles: StyleRulesCallback = theme => ({
  root: {
    width: '28vw',
    marginTop: theme.spacing.unit
  },
  equipmentLabel: {
    height: 70
  }
})

export interface IAirCorps {
  id: number
  operationId: number
  index: number
  equipments: any[]
}

export interface ILandBasedFleetCardProps extends WithStyles {
  airCorps: IAirCorps
  classes: { [key in string]: string }
}

const LandBasedFleetCard: React.SFC<ILandBasedFleetCardProps> = ({ airCorps, classes }) => {
  return (
    <Card className={classes.root}>
      <Typography>{`第${airCorps.index + 1}航空隊`}</Typography>
      {airCorps.equipments.map((equip, index) => (
        <EquipmentLabel
          key={index}
          className={classes.equipmentLabel}
          landBasedAirCorpsId={airCorps.id}
          index={index}
          equipmentId={equip && equip.id}
          slotSize={18}
        />
      ))}
    </Card>
  )
}

const WithStyles = withStyles(styles)(LandBasedFleetCard)
export default withDragAndDrop('LandBasedFleetCard')(WithStyles)
