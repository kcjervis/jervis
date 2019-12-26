import React from "react"

const useTimer = ({ onEnd, timeout }: { onEnd: () => void; timeout: number }) => {
  const timer = React.useRef<number | null>()

  const start = React.useCallback(() => {
    if (!timer.current) {
      timer.current = window.setTimeout(() => {
        onEnd()
        timer.current = null
      }, timeout)
    }
  }, [onEnd, timeout])

  const reset = React.useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current)
      timer.current = null
    }
  }, [])

  return { start, reset }
}

export default useTimer
