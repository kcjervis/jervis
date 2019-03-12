import React, { useRef, useCallback } from 'react'
import { observer } from 'mobx-react-lite'

import TextField from '@material-ui/core/TextField'

import { ObservableOperation } from '../../stores'

interface OperationDescriptionFieldProps {
  operation: ObservableOperation
}

const OperationDescriptionField: React.FC<OperationDescriptionFieldProps> = ({ operation }) => {
  const { description } = operation
  const inputRef = useRef<HTMLInputElement>()
  const handleChange = useCallback(() => {
    if (inputRef.current) {
      operation.description = inputRef.current.value
    }
  }, [operation])

  return <TextField label="description" inputRef={inputRef} value={description} onChange={handleChange} />
}

export default observer(OperationDescriptionField)
