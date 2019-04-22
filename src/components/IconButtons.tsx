import React from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'

import { Omit } from '@material-ui/core'
import IconButton, { IconButtonProps } from '@material-ui/core/IconButton'
import Add from '@material-ui/icons/Add'
import CloseIcon from '@material-ui/icons/Close'
import Delete from '@material-ui/icons/Delete'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import LinkIcon from '@material-ui/icons/Link'
import MoreVert from '@material-ui/icons/MoreVert'
import RefreshIcon from '@material-ui/icons/Refresh'
import InfoIcon from '@material-ui/icons/Info'
import SaveIcon from '@material-ui/icons/Save'
import ShareIcon from '@material-ui/icons/Share'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'

import withIconButton, { WithIconButtonProps } from '../hocs/withIconButton'

export const AddButton = withIconButton(Add)
export const CloseButton = withIconButton(CloseIcon)
export const MoreVertButton = withIconButton(MoreVert)
export const RemoveButton = withIconButton(Delete)
export const UpdateButton = withIconButton(RefreshIcon)
export const LinkButton = withIconButton(LinkIcon)
export const ShareButton = withIconButton(ShareIcon)
export const SaveButton = withIconButton(SaveIcon)
export const InfoButton = withIconButton(InfoIcon)

const SimpleCopyButton = withIconButton(FileCopyIcon)

type CopyButtonProps = Omit<WithIconButtonProps, 'onCopy'> & Partial<CopyToClipboard.Props>

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
