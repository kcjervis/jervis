import React from 'react'
import classNames from 'classnames'

import { Theme } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'

import { makeStyles, createStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginLeft: 8,
      display: 'flex',
      alignItems: 'center',
      maxWidth: '100%',
      height: 24,
      fontSize: '1rem',
      color: theme.palette.text.primary
    },
    typography: {
      marginLeft: 8,
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis'
    }
  })
)

type ItemLabelProps = {
  icon: React.ReactElement
  text: string
} & React.HTMLAttributes<HTMLDivElement>

const ItemLabel: React.FC<ItemLabelProps> = ({ icon, text, className, ...divProps }) => {
  const classes = useStyles()
  return (
    <div className={classNames(classes.root, className)} {...divProps}>
      {icon}
      <Typography className={classes.typography} variant="caption" color="inherit">
        {text}
      </Typography>
    </div>
  )
}

export default ItemLabel
