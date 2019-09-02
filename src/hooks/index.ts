import { useCallback, useState } from "react"

export const useOpen = (initialOpen = false) => {
  const [open, setOpen] = useState(initialOpen)
  const onOpen = useCallback(() => setOpen(true), [setOpen])
  const onClose = useCallback(() => setOpen(false), [setOpen])
  return {
    open,
    onOpen,
    onClose
  }
}

export { default as useBaseStyles } from "./useBaseStyles"
export { default as useAnchorEl } from "./useAnchorEl"
export { default as useHover } from "./useHover"
export { default as useSelect } from "./useSelect"
export { default as useInput } from "./useInput"
export { default as useCheck } from "./useCheck"
export { default as useDragAndDrop } from "./useDragAndDrop"
export { default as useOperationStore } from "./useOperationStore"
export { default as useWorkspace } from "./useWorkspace"
export { default as useGearSelect } from "./useGearSelect"
