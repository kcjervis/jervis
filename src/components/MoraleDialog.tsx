import React, { useCallback } from "react"

import green from "@material-ui/core/colors/green"
import orange from "@material-ui/core/colors/orange"
import red from "@material-ui/core/colors/red"
import yellow from "@material-ui/core/colors/yellow"
import LinearProgress from "@material-ui/core/LinearProgress"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import { makeStyles, Theme } from "@material-ui/core/styles"

import MoraleBar, { MoraleBarProps } from "./MoraleBar"
import Dialog, { DialogProps } from "./Dialog"
import Flexbox from "./Flexbox"

type MoraleDialogProps = { onChange: (value: number) => void } & MoraleBarProps & Omit<DialogProps, "onChange">

export default function MoraleDialog({ value, onChange, ...dialogProps }: MoraleDialogProps) {
  const setSparkling = useCallback(() => onChange(85), [onChange])
  const setNormal = useCallback(() => onChange(49), [onChange])
  const setOrange = useCallback(() => onChange(29), [onChange])
  const setRed = useCallback(() => onChange(0), [onChange])
  return (
    <Dialog {...dialogProps}>
      <Flexbox m={4}>
        <Button onClick={setRed}>赤疲労</Button>
        <Button onClick={setOrange}>橙疲労</Button>
        <Button onClick={setNormal}>無疲労</Button>
        <Button onClick={setSparkling}>キラ</Button>
      </Flexbox>
    </Dialog>
  )
}
