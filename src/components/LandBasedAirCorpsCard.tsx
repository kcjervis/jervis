import React from 'react'

import Card from '@material-ui/core/Card'
import { StyleRulesCallback, withStyles, WithStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import EquipmentLabel from '../containers/EquipmentLabel'
import withDragAndDrop from '../hocs/withDragAndDrop'

import { LandBasedAirCorpsModel } from '../calculator'

const styles: StyleRulesCallback = theme => ({
  root: {
    width: '28vw',
    marginTop: theme.spacing.unit
  },
  equipmentLabel: {
    height: 70
  }
})

export interface ILandBasedAirCorpsCardProps extends WithStyles {
  landBasedAirCorps: LandBasedAirCorpsModel
  classes: { [key in string]: string }
}

const LandBasedAirCorpsCard: React.SFC<ILandBasedAirCorpsCardProps> = ({ landBasedAirCorps, classes }) => {
  // 装備のindexから、空情報を含む配列を生成
  const displayedEquipments = Array.from({ length: 4 }, (_, labelIndex) =>
    landBasedAirCorps.equipments.find(equip => equip.index === labelIndex)
  )
  return (
    <Card className={classes.root}>
      <Typography>{`第${landBasedAirCorps.index + 1}航空隊`}</Typography>
      {displayedEquipments.map((equip, index) => (
        <EquipmentLabel
          key={index}
          className={classes.equipmentLabel}
          landBasedAirCorpsId={landBasedAirCorps.id}
          index={index}
          equipmentId={equip && equip.id}
          slotSize={landBasedAirCorps.slots[index]}
        />
      ))}
    </Card>
  )
}

const WithStyles = withStyles(styles)(LandBasedAirCorpsCard)
export default withDragAndDrop('LandBasedAirCorpsCard')(WithStyles)
