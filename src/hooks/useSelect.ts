import { useState, useEffect } from "react"

const useSelect = <OptionType>(options: readonly OptionType[], defaultOption: OptionType = options[0]) => {
  const [value, onChange] = useState(defaultOption)

  useEffect(() => {
    if (!options.includes(value)) {
      onChange(defaultOption)
    }
  }, [options])

  useEffect(() => onChange(defaultOption), [defaultOption])

  return { options, value, onChange }
}

export default useSelect
