import React, { useCallback, useRef } from "react"

import Button from "@material-ui/core/Button"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import TextField from "@material-ui/core/TextField"

import DialogComponent from "../../components/DialogComponent"
import HealthBar, { useBackgroundColorStyles } from "../../components/HealthBar"

import { ObservableShip } from "../../stores"

const HealthBarDialog: React.FC<{ ship: ObservableShip }> = ({ ship }) => {
  const classes = useBackgroundColorStyles()
  const inputRef = useRef({ value: ship.currentHp.toString() })
  const { health } = ship.asKcObject
  const { currentHp, maxHp } = health
  const setcurrentHp = useCallback(
    (value: number) => {
      ship.currentHp = value
    },
    [ship]
  )

  const handleChange = useCallback(() => setcurrentHp(Number(inputRef.current.value)), [])
  const handleClickMax = useCallback(() => setcurrentHp(maxHp), [maxHp])
  const handleClickShouha = useCallback(() => setcurrentHp(Math.floor(maxHp * (3 / 4))), [maxHp])
  const handleClickChuuha = useCallback(() => setcurrentHp(Math.floor(maxHp / 2)), [maxHp])
  const handleClickHeavy = useCallback(() => setcurrentHp(Math.floor(maxHp / 4)), [maxHp])

  return (
    <DialogComponent
      buttonProps={{ fullWidth: true, style: { display: "block" } }}
      buttonLabel={<HealthBar health={health} />}
    >
      <DialogTitle>{ship.asKcObject.name}</DialogTitle>
      <DialogContent>
        <HealthBar health={health} />
        <TextField
          type="number"
          inputProps={{ min: 0, max: maxHp }}
          value={currentHp}
          inputRef={inputRef}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button className={classes.taihaColor} onClick={handleClickHeavy}>
          大破
        </Button>
        <Button className={classes.chuuhaColor} onClick={handleClickChuuha}>
          中破
        </Button>
        <Button className={classes.shouhaColor} onClick={handleClickShouha}>
          小破
        </Button>
        <Button className={classes.lessColor} onClick={handleClickMax}>
          Max
        </Button>
      </DialogActions>
    </DialogComponent>
  )
}

export default HealthBarDialog
