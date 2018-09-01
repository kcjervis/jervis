import { StyleRulesCallback, withStyles, WithStyles } from '@material-ui/core/styles'
import React from 'react'
import { connect, MapDispatchToProps } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'

import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'

import { MoreVertButton, RemoveButton } from '../components/IconButtons'

import withAlertDialog from '../hocs/withAlertDialog'
import withDragSortable from '../hocs/withDragSortable'

import { actions } from '../redux/modules/orm'

const RemoveDialog = withAlertDialog(RemoveButton)

const styles: StyleRulesCallback = theme => ({
  root: {
    display: 'flex',
    margin: theme.spacing.unit * 0.5
  }
})

interface IDispatchProps {
  onRemove: () => void
}

interface IOperationCardProps extends IDispatchProps, WithStyles, RouteComponentProps<{}> {
  operationId: number
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

const mapDispatchToProps: MapDispatchToProps<IDispatchProps, IOperationCardProps> = (dispatch, props) => ({
  onRemove: () => {
    dispatch(actions.removeOperation(props.operationId))
  },
  onSortEnd: ({ dragProps, hoverProps }: any) => {
    const dragId = dragProps.operationId
    const hoverId = hoverProps.operationId
    if (dragId === hoverId) {
      return
    }
    dispatch(actions.updateOperation({ id: dragId, index: hoverProps.index }))
    dispatch(actions.updateOperation({ id: hoverId, index: dragProps.index }))
  }
})

const WithDragSortable = withDragSortable('OperationCard')(OperationCard)
const Connected = connect(
  null,
  mapDispatchToProps
)(WithDragSortable)

export default withStyles(styles)(withRouter(Connected))
