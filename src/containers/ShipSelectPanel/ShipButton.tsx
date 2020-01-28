import { MasterShip } from "kc-calculator"
import React, { useCallback } from "react"

import Button from "@material-ui/core/Button"
import Box from "@material-ui/core/Box"
import { makeStyles } from "@material-ui/core/styles"

import { ShipBanner, MasterShipCard, Text, Tooltip } from "../../components"

const useStyles = makeStyles(theme => ({
  button: { padding: 4, justifyContent: "start", width: theme.spacing(30) },
  shipImage: {
    width: theme.spacing(15),
    flexShrink: 0
  }
}))

type ShipButtonProps = {
  ship: MasterShip
  onClick: (ship: MasterShip) => void
}

const ShipButton: React.FC<ShipButtonProps> = ({ ship, onClick }) => {
  const styles = useStyles()
  const handleClick = useCallback(() => onClick(ship), [ship, onClick])
  return (
    <Tooltip enterDelay={800} TransitionProps={{ style: { maxWidth: 1000 } }} title={<MasterShipCard ship={ship} />}>
      <Button className={styles.button} onClick={handleClick}>
        <ShipBanner className={styles.shipImage} shipId={ship.shipId} />
        <Box ml={1}>
          {ship.isAbyssal && <Text align="left">ID:{ship.shipId}</Text>}
          <Text align="left">{ship.name}</Text>
        </Box>
      </Button>
    </Tooltip>
  )
}

export default ShipButton
