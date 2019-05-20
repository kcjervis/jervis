import { MasterShip } from 'kc-calculator'
import React, { useCallback } from 'react'

import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'

import { ShipImage, MasterShipCard } from '../../components'

type ShipButtonProps = {
  ship: MasterShip
  onClick: (ship: MasterShip) => void
}

const ShipButton: React.FC<ShipButtonProps> = ({ ship, onClick }) => {
  const handleClick = useCallback(() => onClick(ship), [ship, onClick])
  return (
    <Tooltip enterDelay={800} TransitionProps={{ style: { maxWidth: 1000 } }} title={<MasterShipCard ship={ship} />}>
      <Button style={{ padding: 4, justifyContent: 'start', width: 8 * 30 }} onClick={handleClick}>
        <ShipImage style={{ width: 8 * 15, flexShrink: 0 }} imageType="banner" masterId={ship.id} />
        <Box ml={1}>
          {ship.isAbyssal && (
            <Typography variant="caption" component="div" align="left">
              ID:{ship.id}
            </Typography>
          )}
          <Typography variant="caption" component="div" align="left">
            {ship.name}
          </Typography>
        </Box>
      </Button>
    </Tooltip>
  )
}

export default ShipButton
