import React from 'react'
import clsx from 'clsx'

import Button from '@material-ui/core/Button'
import { makeStyles, Theme } from '@material-ui/core/styles'
import BuildIcon from '@material-ui/icons/Build'
import AddIcon from '@material-ui/icons/Add'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: 0,
    height: '100%',
    color: theme.palette.action.disabled,
    '&:hover': {
      color: theme.palette.action.active
    }
  }
}))

type AddItemButtonProps = {
  slotSize?: number
  onClick?: () => void
}

const AddItemButton: React.FC<AddItemButtonProps> = ({ slotSize, onClick }) => {
  const classes = useStyles()
  const isExpansionSlot = slotSize === undefined
  const icon = isExpansionSlot ? (
    <BuildIcon fontSize="small" style={{ fontSize: '1rem' }} />
  ) : (
    <>
      <AddIcon fontSize="small" />({slotSize})
    </>
  )
  return (
    <Button onClick={onClick} fullWidth className={classes.root}>
      {icon}
    </Button>
  )
}

export default AddItemButton
