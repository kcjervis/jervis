import { createContext } from 'react'
import { action, observable } from 'mobx'
import { ShipSelectPanelProps } from './ShipSelectPanel'

class ShipSelectPanelState {
  @observable public open = false

  @observable public props?: ShipSelectPanelProps

  @action public onOpen = (props?: Partial<ShipSelectPanelProps>) => {
    this.open = true
    if (!props) {
      return
    }
    const onSelect: NonNullable<ShipSelectPanelProps['onSelect']> = data => {
      props.onSelect && props.onSelect(data)
      this.onClose()
    }
    this.props = { ...props, onSelect }
  }

  @action public onClose = () => {
    this.open = false
    this.props = undefined
  }
}

export default createContext(new ShipSelectPanelState())
