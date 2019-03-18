import { useState } from 'react'
import { Formation } from 'kc-calculator'

const useFormation = (initFormation: Formation = Formation.LineAhead) => {
  const [formation, setFormation] = useState<Formation>(initFormation)
  return { formation, setFormation }
}

export default useFormation
