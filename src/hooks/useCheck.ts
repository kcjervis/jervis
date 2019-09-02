import React, { useState, useCallback } from "react"

const useCheck = (initial = false) => {
  const [checked, setChecked] = useState(initial)

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => setChecked(event.currentTarget.checked),
    [setChecked]
  )

  return { checked, onChange }
}

export default useCheck
