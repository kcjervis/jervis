import { createContext } from "react"
import { action, observable } from "mobx"
import { ShipSelectPanelProps } from "./ShipSelectPanel"
import { MasterShip } from "kc-calculator"

export type ShipFilter = {
  name: string
  filter: (ship: MasterShip) => boolean
}

class ShipSelectPanelState {
  @observable public open = false

  @observable public props?: ShipSelectPanelProps

  @observable public defaultFilter?: ShipFilter

  @action public onOpen = (props?: Partial<ShipSelectPanelProps>) => {
    this.open = true
    if (!props) {
      return
    }
    const onSelect: NonNullable<ShipSelectPanelProps["onSelect"]> = data => {
      props.onSelect && props.onSelect(data)
      this.onClose()
    }

    const { defaultFilter, setDefaultFilter } = this
    this.props = { defaultFilter, onFilterChange: setDefaultFilter, ...props, onSelect }
  }

  @action public onClose = () => {
    this.open = false
  }

  @action public setDefaultFilter = (filter: ShipFilter) => {
    this.defaultFilter = filter
  }
}

export default createContext(new ShipSelectPanelState())
