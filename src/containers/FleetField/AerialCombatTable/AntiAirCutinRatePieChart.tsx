import React, { useState } from 'react'
import { PieChart, Pie, Label, Cell } from 'recharts'

import { blue, green, yellow, orange, pink, purple, blueGrey } from '@material-ui/core/colors'
import { makeStyles, createStyles, useTheme } from '@material-ui/styles'
import { Theme } from '@material-ui/core'

import { AntiAirCutinRateDatum } from './calcAntiAirCutinRate'
import { toPercent } from '../../../utils'

const misfireColor = blueGrey[300]
const cutinColors = [blue, green, yellow, orange, pink, purple].map(color => color[300])

type AntiAirCutinRatePieChartProps = { data: AntiAirCutinRateDatum[] }

const AntiAirCutinRatePieChart: React.FC<AntiAirCutinRatePieChartProps> = ({ data }) => {
  const theme = useTheme<Theme>()
  const totalRate = data.reduce((total, datum) => total + datum.rate, 0)
  const displayedData = data.map(({ cutin, rate }) => ({ name: cutin.id + '種', rate }))
  displayedData.push({ name: '不発', rate: 1 - totalRate })

  const getColor = (index: number) =>
    index === displayedData.length - 1 ? misfireColor : cutinColors[index % cutinColors.length]
  return (
    <PieChart width={400} height={8 * 35}>
      <Pie
        data={displayedData}
        dataKey="rate"
        innerRadius={60}
        outerRadius={80}
        paddingAngle={4}
        label={labelPorps => `${labelPorps.name} ${toPercent(labelPorps.rate)}`}
      >
        {displayedData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={getColor(index)} />
        ))}
        <Label value={`合計 ${toPercent(totalRate)}`} fill={theme.palette.text.primary} position="center" />
      </Pie>
    </PieChart>
  )
}

export default AntiAirCutinRatePieChart
