import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'

import Button from '@material-ui/core/Button'
import Add from '@material-ui/icons/Add'

const AddEquipmentButton = ({
  shipId,
  landBasedAirCorpsId,
  index,
  slotSize,
  history,
  className
}) => {
  const handleClick = () => {
    history.push('./equipments', { shipId, landBasedAirCorpsId, index })
  }
  return (
    <Button className={className} onClick={handleClick}>
      <Add />
      {`装備(${index === 'expansionEquipment' ? '補強増設' : slotSize})`}
    </Button>
  )
}

AddEquipmentButton.propTypes = {
  shipId: PropTypes.number,
  landBasedAirCorpsId: PropTypes.number,
  index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  slotSize: PropTypes.number,
  history: PropTypes.object.isRequired,
  className: PropTypes.string
}

export default withRouter(AddEquipmentButton)
