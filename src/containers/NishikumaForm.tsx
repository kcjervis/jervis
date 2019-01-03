import React from 'react'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

class NishikumaForm extends React.Component {
  public render() {
    return (
      <div>
        154
        <TextField
          label="デッキビルダー形式"
          style={{ margin: 8 }}
          placeholder="Placeholder"
          fullWidth={true}
          margin="normal"
          variant="outlined"
        />
      </div>
    )
  }
}

export default NishikumaForm
