import React from "react"
import { observer } from "mobx-react"
import clsx from "clsx"
import { makeStyles, withStyles } from "@material-ui/core/styles"

import MuiButton from "@material-ui/core/Button"

import { ObservableOperation } from "../../stores"
import { useDragAndDrop } from "../../hooks"
import { swap } from "../../utils"

const Button = withStyles({
  root: {
    padding: "0px 8px",
    boxSizing: "border-box"
  },
  label: {
    height: 40,
    minWidth: 24
  }
})(MuiButton)

const useStyles = makeStyles(theme => ({
  button: {
    borderRadius: 0,
    boxSizing: "border-box",
    borderBlockEnd: `solid 2px rgba(0, 0, 0, 0)`,
    color: theme.palette.text.disabled
  },
  selected: {
    borderBlockEnd: `solid 2px ${theme.palette.primary.main}`,
    color: theme.palette.text.primary
  }
}))

type FleetTabProps = {
  className: string
  onClick: (value: number) => void
  index: number
  isCombinedFleet: boolean
  onSwap: (dragIndex: number, dropIndex: number) => void
}

const FleetTab: React.FC<FleetTabProps> = ({ className, onClick, index, isCombinedFleet, onSwap }) => {
  const handleClick = React.useCallback(() => onClick(index), [onClick, index])
  const [, ref] = useDragAndDrop({
    item: { type: "FleetTab", index },
    drop: dragItem => onSwap(dragItem.index, index)
  })

  const label = isCombinedFleet && index < 2 ? `連合第${index + 1}` : `${index + 1}`
  return (
    <Button innerRef={ref} size="large" className={className} onClick={handleClick}>
      {label}
    </Button>
  )
}

type Props = {
  operation: ObservableOperation
}

const Component: React.FC<Props> = ({ operation }) => {
  const classes = useStyles()

  const value = operation.activeFleetIndex
  const { lbIndex, gkcoiIndex } = operation
  const isCombinedFleet = operation.asKcObject.isCombinedFleetOperation

  const handleTabChange = React.useCallback(
    (value: number) => {
      operation.activeFleetIndex = value
    },
    [operation]
  )

  const handleSwap = React.useCallback(
    (dragIndex: number, dropIndex: number) => {
      const { fleets } = operation
      swap(fleets, dragIndex, fleets, dropIndex)
    },
    [operation]
  )

  const handleLbClick = React.useCallback(() => handleTabChange(lbIndex), [handleTabChange, lbIndex])
  const handleGkcoiClick = React.useCallback(() => handleTabChange(gkcoiIndex), [handleTabChange, gkcoiIndex])
  return (
    <>
      {operation.fleets.map((fleet, index) => (
        <FleetTab
          key={index}
          className={clsx(classes.button, { [classes.selected]: index === value })}
          onClick={handleTabChange}
          index={index}
          isCombinedFleet={isCombinedFleet}
          onSwap={handleSwap}
        />
      ))}
      {operation.landBase.length > 0 && (
        <Button
          className={clsx(classes.button, { [classes.selected]: lbIndex === value })}
          variant="text"
          size="large"
          onClick={handleLbClick}
        >
          基地航空隊
        </Button>
      )}
      <Button
        className={clsx(classes.button, { [classes.selected]: gkcoiIndex === value })}
        variant="text"
        size="large"
        onClick={handleGkcoiClick}
      >
        画像出力
      </Button>
    </>
  )
}

export default observer(Component)
