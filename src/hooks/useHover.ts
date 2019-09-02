import { useRef, useState, useEffect, useCallback } from "react"

export default function useHover() {
  const [value, setValue] = useState(false)

  const ref = useRef<HTMLDivElement>(null)

  const handleMouseEnter = useCallback(() => setValue(true), [setValue])
  const handleMouseLeave = useCallback(() => setValue(false), [setValue])

  useEffect(() => {
    const node = ref.current
    if (node) {
      node.addEventListener("mouseenter", handleMouseEnter)
      node.addEventListener("mouseleave", handleMouseLeave)

      return () => {
        node.removeEventListener("mouseenter", handleMouseEnter)
        node.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
    return
  }, [ref.current])

  return [value, ref] as const
}
