import { AirControlState, IPlane, Contact } from "kc-calculator"
import { sumBy } from "lodash-es"
import React from "react"

import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import Typography from "@material-ui/core/Typography"

import { toPercent } from "../../utils"
import { Text } from "../../components"

interface ContactTableProps {
  planes: IPlane[]
}

export default class ContactTable extends React.Component<ContactTableProps> {
  public render() {
    const { planes } = this.props
    const { AirSupremacy, AirSuperiority, AirDenial } = AirControlState

    const contactCalculator = new Contact(planes)
    const contactChances = [AirSupremacy, AirSuperiority, AirDenial].map(contactCalculator.calcRate)

    if (contactChances[0].successRate === 0) {
      return (
        <Typography variant="h6" align="center">
          触接不可
        </Typography>
      )
    }

    return (
      <>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>制空</TableCell>
              <TableCell align="right">触接開始率</TableCell>
              <TableCell align="right">1.2触接率</TableCell>
              <TableCell align="right">1.17触接率</TableCell>
              <TableCell align="right">1.12触接率</TableCell>
              <TableCell align="right">合計触接率</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contactChances.map(contactChanceInfo => {
              const { airControlState, successRate, triggerRate, selectionRateMap, rateMap } = contactChanceInfo
              return (
                <TableRow key={airControlState.name}>
                  <TableCell scope="row">{airControlState.name}</TableCell>
                  <TableCell align="right">{toPercent(triggerRate)}</TableCell>
                  <TableCell align="right">{toPercent(rateMap[1.2])}</TableCell>
                  <TableCell align="right">{toPercent(rateMap[1.17])}</TableCell>
                  <TableCell align="right">{toPercent(rateMap[1.12])}</TableCell>
                  <TableCell align="right">{toPercent(successRate)}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        <Text color="textSecondary" style={{ marginTop: 8 }}>
          1.2触接率 = 開始率 × 1.2選択率
        </Text>
      </>
    )
  }
}
