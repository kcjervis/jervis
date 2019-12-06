import { action, computed, observable } from "mobx"
import { persist } from "mobx-persist"

import ObservableOperation from "./ObservableOperation"
import { setDeckbuilder } from "../utils"
import { Store } from "../types"

export default class OperationStore implements Store<ObservableOperation> {
  @persist("list", ObservableOperation) @observable public operations = observable<ObservableOperation>([])

  @action public createOperation = (name = `編成${this.operations.length + 1}`) => {
    const newOperation = new ObservableOperation()
    newOperation.store = this
    newOperation.name = name
    this.operations.push(newOperation)
    return newOperation
  }

  @action public set = (index: number, operation: ObservableOperation) => {
    this.operations[index] = operation
    operation.store = this
  }

  @action public push = (operation: ObservableOperation) => {
    operation.remove()
    this.operations.push(operation)
    operation.store = this
  }

  @action public setOperations = (list: ObservableOperation[]) => {
    this.operations = observable(list)
  }

  @action public fromNishikuma = (json: string, name?: string) => {
    const deckObject = JSON.parse(json.replace(/^http:\/\/kancolle-calc\.net\/deckbuilder\.html\?predeck=/, ""))
    const newOperation = this.createOperation(name)
    return setDeckbuilder(newOperation, deckObject)
  }

  @action public copyOperation = (operation: ObservableOperation) => {
    const newOperation = ObservableOperation.create(operation)
    newOperation.store = this
    newOperation.name = `${operation.name}のコピー`
    this.operations.push(newOperation)
    return newOperation
  }

  public getOperation = (id: string) => {
    return this.operations.find(operation => operation.id === id)
  }

  @action public initialize = () => {
    this.operations.forEach(operation => operation.initialize(this))
  }
}
