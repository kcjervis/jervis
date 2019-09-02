import { IGear } from "kc-calculator"
import React from "react"

import { gearStatKeys } from "kc-calculator"

import Button from "@material-ui/core/Button"

import { DataTableCell } from "../../components/DataTable"
import StatLabel from "../../components/StatLabel"

const GearStatsCell: React.FC<{ gear: IGear }> = ({ gear }) => {
  return (
    <DataTableCell>
      {gearStatKeys.map(statKey => {
        const value = gear[statKey]
        if (!value) {
          return null
        }
        return <StatLabel key={statKey} stat={value} statKey={statKey} style={{ margin: 8 }} />
      })}
    </DataTableCell>
  )
}

export default GearStatsCell
