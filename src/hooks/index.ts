import { useCallback, useState } from 'react'

export const useOpen = () => {
  const [open, setOpen] = useState(false)
  const handleOpen = useCallback(() => setOpen(true), [setOpen])
  const handleClose = useCallback(() => setOpen(false), [setOpen])
  return {
    open,
    handleOpen,
    handleClose
  }
}

export { default as useBaseStyles } from './useBaseStyles'
export { default as useAnchorEl } from './useAnchorEl'
