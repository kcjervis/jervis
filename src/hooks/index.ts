import { useCallback, useState } from 'react'

export const useOpen = () => {
  const [open, setOpen] = useState(false)
  const onOpen = useCallback(() => setOpen(true), [setOpen])
  const onClose = useCallback(() => setOpen(false), [setOpen])
  return {
    open,
    onOpen,
    onClose
  }
}

export { default as useBaseStyles } from './useBaseStyles'
export { default as useAnchorEl } from './useAnchorEl'
