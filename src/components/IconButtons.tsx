import React from "react"
import CopyToClipboard from "react-copy-to-clipboard"

import { Omit } from "@material-ui/core"
import IconButton, { IconButtonProps } from "@material-ui/core/IconButton"
import AddIcon from "@material-ui/icons/Add"
import RemoveIcon from "@material-ui/icons/Remove"
import ClearIcon from "@material-ui/icons/Clear"
import CloseIcon from "@material-ui/icons/Close"
import Delete from "@material-ui/icons/Delete"
import FileCopyIcon from "@material-ui/icons/FileCopy"
import LinkIcon from "@material-ui/icons/Link"
import MoreVert from "@material-ui/icons/MoreVert"
import CachedIcon from "@material-ui/icons/Cached"
import InfoIcon from "@material-ui/icons/Info"
import SaveIcon from "@material-ui/icons/Save"
import ShareIcon from "@material-ui/icons/Share"
import VisibilityIcon from "@material-ui/icons/Visibility"
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff"

import withIconButton, { WithIconButtonProps } from "../hocs/withIconButton"

export const AddButton = withIconButton(AddIcon)
export const IncreaseButton = AddButton
export const DecreaseButton = withIconButton(RemoveIcon)
export const CloseButton = withIconButton(CloseIcon)
export const ClearButton = withIconButton(ClearIcon)
export const MoreVertButton = withIconButton(MoreVert)
export const RemoveButton = withIconButton(Delete)
export const UpdateButton = withIconButton(CachedIcon)
export const LinkButton = withIconButton(LinkIcon)
export const ShareButton = withIconButton(ShareIcon)
export const SaveButton = withIconButton(SaveIcon)
export const InfoButton = withIconButton(InfoIcon)

const SimpleCopyButton = withIconButton(FileCopyIcon)

type CopyButtonProps = Omit<WithIconButtonProps, "onCopy"> & Partial<CopyToClipboard.Props>

export const CopyButton: React.FC<CopyButtonProps> = ({ text, onCopy, options, ...buttonProps }) => {
  const Button = <SimpleCopyButton {...buttonProps} />
  if (text) {
    return (
      <CopyToClipboard text={text} onCopy={onCopy} options={options}>
        {Button}
      </CopyToClipboard>
    )
  }
  return Button
}

interface VisibilityButtonProps extends IconButtonProps {
  visible: boolean
}
export const VisibilityButton: React.FC<VisibilityButtonProps> = ({ visible, ...iconButtonProps }) => (
  <IconButton {...iconButtonProps}>{visible ? <VisibilityIcon /> : <VisibilityOffIcon />}</IconButton>
)
