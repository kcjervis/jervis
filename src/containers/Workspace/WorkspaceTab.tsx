import React, { useContext } from 'react'
import classNames from 'classnames'
import useReactRouter from 'use-react-router'

import grey from '@material-ui/core/colors/grey'
import Paper from '@material-ui/core/Paper'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import InsertChartIcon from '@material-ui/icons/BarChart'
import { makeStyles, createStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core'

import { useOpen, useBaseStyles } from '../../hooks'
import { OperationStoreContext } from '../../stores'
import { CloseButton } from '../../components/IconButtons'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    divider: {
      width: 1,
      height: '60%',
      backgroundColor: grey[500]
    },
    icon: {
      margin: 4
    },
    name: {
      cursor: 'pointer'
    },
    inactive: {
      color: grey[500]
    }
  })
)

interface WorkspaceTabProps {
  name: string
  active?: boolean
  onClick?: () => void
  onClose?: () => void
}

const WorkspaceTab: React.FC<WorkspaceTabProps> = ({ name, active, onClick, onClose }) => {
  const classes = useStyles()
  const baseClasses = useBaseStyles()
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className={classNames(classes.name, baseClasses.flexbox)} onClick={onClick}>
          <InsertChartIcon fontSize="small" color="secondary" className={classes.icon} />
          <Typography className={classNames(!active && classes.inactive)} variant="caption">
            {name}
          </Typography>
        </div>
        <div style={{ width: 28 }}>{onClose && <CloseButton size="small" />}</div>
        <div className={classes.divider} />
      </div>
    </>
  )
}

export default WorkspaceTab
