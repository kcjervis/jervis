import { Formation } from 'kc-calculator'
import React from 'react'

import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'

interface FormationSelectProps {
  formation: Formation
  onChange: (airControlState: Formation) => void
}

const FormationSelect: React.FC<FormationSelectProps> = ({ formation, onChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const from = Formation.fromId(Number(event.target.value))
    onChange(from as Formation)
  }
  return (
    <FormControl>
      <InputLabel>陣形</InputLabel>
      <Select variant="outlined" value={formation.api} onChange={handleChange}>
        {Formation.all.map(form => (
          <MenuItem key={form.api} value={form.api}>
            {form.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default FormationSelect
