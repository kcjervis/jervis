import React from "react"

import ShipBanner from "./ShipBanner"
import { NumberInput } from ".."

export default { title: "molecules|ShipBanner" }

export const icon = () => {
  const [id, setId] = React.useState(1)
  return (
    <>
      <NumberInput label="id" value={id} onChange={setId} />
      <ShipBanner shipId={id} />
    </>
  )
}
