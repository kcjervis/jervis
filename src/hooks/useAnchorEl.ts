import { useCallback, useState } from 'react'

const useAnchorEl = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const onClick = useCallback((event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget), [])
  const onClose = useCallback(() => setAnchorEl(null), [])

  return {
    anchorEl,
    onClick,
    onClose
  }
}

export default useAnchorEl
