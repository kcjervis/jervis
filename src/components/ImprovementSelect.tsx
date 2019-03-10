import classNames from 'classnames'
import range from 'lodash/range'
import React from 'react'

import { Theme } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import cyan from '@material-ui/core/colors/cyan'
import Popover from '@material-ui/core/Popover'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'

import { useAnchorEl, useBaseStyles } from '../hooks'

const useStyles = makeStyles((theme: Theme) => ({
  improvementColor: {
    color: cyan[500]
  },
  selectButton: {
    height: theme.spacing(5)
  }
}))

interface ImprovementSelectProps {
  value: number
  onChange: (value: number) => void
}

const ImprovementSelect: React.FC<ImprovementSelectProps> = ({ value, onChange }) => {
  const { anchorEl, onClick, onClose } = useAnchorEl()
  const baseClasses = useBaseStyles()
  const classes = useStyles()

  const handleImprovementClick = (improveValue: number) => () => {
    onClose()
    onChange(improveValue)
  }
  return (
    <>
      <Tooltip title="改修値選択">
        <Typography className={classNames(classes.improvementColor, baseClasses.brightButton)} onClick={onClick}>
          ★{value}
        </Typography>
      </Tooltip>

      <Popover
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={onClose}
      >
        {range(11).map(improveValue => (
          <Button
            key={improveValue}
            className={classNames(classes.improvementColor, classes.selectButton)}
            onClick={handleImprovementClick(improveValue)}
          >
            ★{improveValue}
          </Button>
        ))}
      </Popover>
    </>
  )
}

export default ImprovementSelect
