import React from "react"
import CopyToClipboard from "react-copy-to-clipboard"

import MuiTooltip from "@material-ui/core/Tooltip"
import Assignment from "@material-ui/icons/Assignment"
import Alert from "@material-ui/lab/Alert"
import { withStyles } from "@material-ui/core/styles"

import { useOpen } from "../../../hooks"
import { withIconButton } from "../../../hocs"

const AssignmentButton = withIconButton(Assignment)

const Tooltip = withStyles({
  tooltip: {
    padding: 0
  }
})(MuiTooltip)

type Props = {
  value: string
  message?: string
}

const Component: React.FC<Props> = ({ value, message = "copied" }) => {
  const { open, onOpen, onClose } = useOpen()

  return (
    <Tooltip
      open={open}
      onClose={onClose}
      placement="top"
      title={
        <Alert variant="outlined" severity="success">
          {message}
        </Alert>
      }
    >
      <div>
        <CopyToClipboard text={value} onCopy={onOpen}>
          <AssignmentButton title="コピー" />
        </CopyToClipboard>
      </div>
    </Tooltip>
  )
}

export default Component
