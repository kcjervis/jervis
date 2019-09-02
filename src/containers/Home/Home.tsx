import React from "react"

import Typography from "@material-ui/core/Typography"
import Box from "@material-ui/core/Box"
import { Flexbox } from "../../components"

export default function Home() {
  return (
    <>
      <Flexbox width="100%" justifyContent="center">
        <Typography variant="h4">作戦室</Typography>
        <Typography variant="h6">Jervis Operations Room</Typography>
      </Flexbox>

      <Typography>ようこそ</Typography>
    </>
  )
}
