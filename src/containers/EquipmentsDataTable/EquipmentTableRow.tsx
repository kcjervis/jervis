import { IEquipment } from 'kc-calculator'
import React from 'react'

import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import { createStyles, withStyles, WithStyles } from '@material-ui/styles'

import EquipmentIcon from '../../components/EquipmentIcon'

const styles = createStyles({})

interface IEquipmentTableRowProps extends WithStyles<typeof styles> {
  equipment: IEquipment
  visibleStats: Array<keyof IEquipment>
}

const EquipmentTableRow: React.FC<IEquipmentTableRowProps> = ({ equipment, visibleStats, classes }) => {
  return (
    <TableRow>
      <TableCell component="th" scope="row">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <EquipmentIcon iconId={equipment.iconId} />
          <Typography variant="caption" align="left">
            {equipment.name}
          </Typography>
        </div>
      </TableCell>
      {visibleStats.map(statKey => (
        <TableCell align="right" key={statKey}>
          {equipment[statKey]}
        </TableCell>
      ))}
    </TableRow>
  )
}

export default withStyles(styles)(EquipmentTableRow)
