import React from "react"

import ShipFull from "./ShipFull"
import { NumberInput } from ".."

export default { title: "molecules|ShipFull" }

export const icon = () => {
  const [id, setId] = React.useState(1)
  return (
    <>
      <NumberInput label="id" value={id} onChange={setId} />
      <ShipFull shipId={id} />
    </>
  )
}
