import { useState, useEffect } from 'react'

const useSelect = <OptionType>(options: OptionType[], defaultOption: OptionType = options[0]) => {
  const [value, onChange] = useState(defaultOption)

  useEffect(() => {
    onChange(defaultOption)
  }, [options.includes(value)])

  return { options, value, onChange }
}

export default useSelect
