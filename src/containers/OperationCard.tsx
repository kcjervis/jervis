import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import { Dispatch } from 'redux'

import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'

import { MoreVertButton, RemoveButton } from '../components/IconButtons'

import withAlertDialog from '../hocs/withAlertDialog'
import withDragSortable from '../hocs/withDragSortable'

import { actions } from '../redux/modules/orm'

const RemoveDialog = withAlertDialog(RemoveButton)

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      margin: theme.spacing.unit * 0.5
    }
  })

interface IOperationCardProps extends WithStyles<typeof styles>, RouteComponentProps {
  operationId: number
  index: number
  onRemove: () => void
  onSortEnd: (obj: { dragProps: IOperationCardProps; hoverProps: IOperationCardProps }) => void
}

const OperationCard: React.SFC<IOperationCardProps> = props => {
  const { operationId, onRemove, history, classes } = props
  const handleClick = () => history.push('./operation', { operationId })
  return (
    <div className={classes.root}>
      <Card style={{ width: 300 }} onClick={handleClick}>
        <Typography>
          new
          {operationId}
        </Typography>
      </Card>
      <RemoveDialog onClick={onRemove} dialogTitle="編成を削除しますか?" />
    </div>
  )
}

interface IDispatchProps {
  operationId: number
  index: number
}

const mapDispatchToProps = (dispatch: Dispatch, props: IDispatchProps) => ({
  onRemove: () => {
    dispatch(actions.removeOperation(props.operationId))
  },
  onSortEnd: ({ dragProps, hoverProps }: { dragProps: any; hoverProps: any }) => {
    const dragId = dragProps.operationId
    const hoverId = hoverProps.operationId
    if (dragId === hoverId) {
      return
    }
    dispatch(actions.updateOperation({ id: dragId, index: hoverProps.index }))
    dispatch(actions.updateOperation({ id: hoverId, index: dragProps.index }))
  }
})

const WithRouter = withRouter(OperationCard)
const WithStyles = withStyles(styles)(WithRouter)
const WithDragSortable = withDragSortable('OperationCard')(WithStyles)
const Connected = connect(
  null,
  mapDispatchToProps
)(WithDragSortable)

export default Connected
