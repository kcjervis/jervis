import React, { useState, useCallback, useMemo } from "react"

const useInput = <T>(initialValue: T) => {
  const [value, setValue] = useState(initialValue)
  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (typeof initialValue === "number") {
        setValue(Number(event.currentTarget.value) as any)
      } else {
        setValue(event.currentTarget.value as any)
      }
    },
    [setValue]
  )

  const type = useMemo(() => (typeof initialValue === "number" ? "number" : undefined), [initialValue])

  return { value, onChange, type }
}

export default useInput
