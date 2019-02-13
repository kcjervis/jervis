import classNames from 'classnames'
import range from 'lodash/range'
import React, { useCallback, useState } from 'react'

import Button from '@material-ui/core/Button'
import cyan from '@material-ui/core/colors/cyan'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
  button: {
    cursor: 'pointer',
    '&:hover': {
      textShadow: `0 0 10px ${cyan[100]}`
    }
  },
  improvementColor: {
    color: cyan[500]
  }
})

const useAnchorEl = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget), [])
  const handleClose = useCallback(() => setAnchorEl(null), [])

  return {
    anchorEl,
    handleClick,
    handleClose
  }
}

interface IImprovementSelectProps {
  value: number
  onChange: (value: number) => void
}

const ImprovementSelect: React.FC<IImprovementSelectProps> = ({ value, onChange }) => {
  const { anchorEl, handleClick, handleClose } = useAnchorEl()
  const classes = useStyles()

  const handleMenuItemClick = (improveValue: number) => () => {
    handleClose()
    onChange(improveValue)
  }
  return (
    <>
      <Button className={classNames(classes.improvementColor)} onClick={handleClick}>
        ★{value}
      </Button>

      <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handleClose}>
        {range(11).map(improveValue => (
          <MenuItem
            key={improveValue}
            className={classes.improvementColor}
            selected={improveValue === value}
            onClick={handleMenuItemClick(improveValue)}
          >
            ★{improveValue}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default ImprovementSelect
