import Add from '@material-ui/icons/Add'
import CloseIcon from '@material-ui/icons/Close'
import Delete from '@material-ui/icons/Delete'
import MoreVert from '@material-ui/icons/MoreVert'
import RefreshIcon from '@material-ui/icons/Refresh'

import withIconButton from '../hocs/withIconButton'

export const AddButton = withIconButton(Add)
export const CloseButton = withIconButton(CloseIcon)
export const MoreVertButton = withIconButton(MoreVert)
export const RemoveButton = withIconButton(Delete)
export const UpdateButton = withIconButton(RefreshIcon)
