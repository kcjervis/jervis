import React from 'react'
import Box, { BoxProps } from '@material-ui/core/Box'

const FlexBox: React.FC<BoxProps> = props => <Box display="flex" alignItems="center" {...props} />

export default FlexBox
