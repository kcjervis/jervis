import { AirControlState, IPlane } from 'kc-calculator'
import sumBy from 'lodash/sumBy'
import React from 'react'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'

interface IContactTableProps {
  planes: IPlane[]
}

export const toPercent = (value: number) => (value * 100).toFixed(1) + '%'

export default class ContactTable extends React.Component<IContactTableProps> {
  public render() {
    const { planes } = this.props
    const { AirSupremacy, AirSuperiority, AirDenial } = AirControlState

    const contactChances = [AirSupremacy, AirSuperiority, AirDenial].map(airControlState => {
      const airStateModifier = airControlState.contactMultiplier

      const totalTriggerFactor = sumBy(
        planes.filter(plane => plane.category.isReconnaissanceAircraft),
        plane => plane.contactTriggerFactor
      )

      const triggerRate = Math.min((totalTriggerFactor + 1) / (70 - 15 * airStateModifier), 1)

      const selectionRateMap = {
        [1.2]: 0,
        [1.17]: 0,
        [1.12]: 0
      }
      const selectionRate = planes
        .filter(plane => plane.canContact)
        .sort((plane1, plane2) => plane2.equipment.accuracy - plane1.equipment.accuracy)
        .reduce((acc, plane) => {
          const curRate = (1 - acc) * plane.contactSelectionRate(airControlState)
          const { accuracy } = plane.equipment
          if (accuracy >= 3) {
            selectionRateMap[1.2] += curRate
          } else if (accuracy === 2) {
            selectionRateMap[1.17] += curRate
          } else {
            selectionRateMap[1.12] += curRate
          }
          return acc + curRate
        }, 0)

      const successRate = triggerRate * selectionRate

      return {
        airControlState,
        successRate,
        triggerRate,
        selectionRateMap
      }
    })

    if (contactChances[0].successRate === 0) {
      return (
        <Typography variant="h6" align="center">
          触接不可
        </Typography>
      )
    }

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>制空</TableCell>
            <TableCell align="right">触接開始率</TableCell>
            <TableCell align="right">合計触接率</TableCell>
            <TableCell align="right">補正1.2選択率</TableCell>
            <TableCell align="right">補正1.17選択率</TableCell>
            <TableCell align="right">補正1.12選択率</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {contactChances.map(contactChanceInfo => {
            const { airControlState, successRate, triggerRate, selectionRateMap } = contactChanceInfo
            return (
              <TableRow key={airControlState.name}>
                <TableCell component="th" scope="row">
                  {airControlState.name}
                </TableCell>
                <TableCell align="right">{toPercent(triggerRate)}</TableCell>
                <TableCell align="right">{toPercent(successRate)}</TableCell>
                <TableCell align="right">{toPercent(selectionRateMap[1.2])}</TableCell>
                <TableCell align="right">{toPercent(selectionRateMap[1.17])}</TableCell>
                <TableCell align="right">{toPercent(selectionRateMap[1.12])}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    )
  }
}
