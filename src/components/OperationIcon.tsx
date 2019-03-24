import React from 'react'

import { SvgIconProps } from '@material-ui/core/SvgIcon'
import BarChartIcon from '@material-ui/icons/BarChart'

const OperationIcon: React.FC<SvgIconProps & { temporary?: boolean }> = ({ temporary, ...iconProps }) => (
  <BarChartIcon fontSize="inherit" color={temporary ? undefined : 'secondary'} {...iconProps} />
)

export default OperationIcon
