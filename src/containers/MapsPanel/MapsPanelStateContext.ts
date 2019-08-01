import { createContext } from 'react'
import { action, observable } from 'mobx'
import { MapsPanelProps } from './MapsPanel'

class MapsPanelState {
  @observable public open = false

  @observable public props?: MapsPanelProps

  @action public onOpen = (props?: MapsPanelProps) => {
    this.open = true
    if (!props) {
      return
    }
    const onSelect: NonNullable<MapsPanelProps['onSelect']> = data => {
      props.onSelect && props.onSelect(data)
      this.onClose()
    }

    this.props = { ...props, onSelect }
  }

  @action public onClose = () => {
    this.open = false
  }
}

export default createContext(new MapsPanelState())
