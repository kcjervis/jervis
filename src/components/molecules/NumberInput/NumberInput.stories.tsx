import React from "react"

import NumberInput from "./NumberInput"

export default { title: "molecules|NumberInput" }

export const numberInput = () => {
  const [value, setValue] = React.useState(0)
  return <NumberInput value={value} onChange={setValue} />
}
