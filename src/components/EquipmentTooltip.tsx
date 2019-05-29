import { makeStyles } from '@material-ui/styles'
import { sortBy as lodashSortBy } from 'lodash-es'
import { observer } from 'mobx-react-lite'
import React, { useCallback, useMemo } from 'react'
import { IEquipment, equipmentStatKeys } from 'kc-calculator'
import clsx from 'clsx'

import Box from '@material-ui/core/Box'
import Select, { SelectProps } from '@material-ui/core/Select'

import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'

import StatIcon from './StatIcon'
import FlexBox from './FlexBox'

type EquipmentTooltipProps = {
  equipment: IEquipment
  children: React.ReactElement
}

const EquipmentTooltip: React.FC<EquipmentTooltipProps> = ({ equipment, ...rest }) => {
  const stats = equipmentStatKeys.map(key => [key, equipment[key]] as const).filter(([key, stat]) => stat !== 0)
  const title = stats.map(([key, stat]) => (
    <FlexBox key={key}>
      <StatIcon statKey={key} />
      <Typography>{stat}</Typography>
    </FlexBox>
  ))
  return <Tooltip enterDelay={300} title={title} {...rest} />
}

export default EquipmentTooltip
