import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import EquipmentLabel from '../acomponents/EquipmentLabel'

import * as selectors from '../redux/modules/selectors'
import { RootState } from '../types'

interface IEquipmentLabelConnectedProps {
  equipmentId: string
}

const mapStateToProps = (state: RootState, props: IEquipmentLabelConnectedProps) => ({
  equipment: selectors.equipmentSelector(state, props)
})

const mapDispatchToProps = (dispatch: Dispatch, props: IEquipmentLabelConnectedProps) => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EquipmentLabel)
