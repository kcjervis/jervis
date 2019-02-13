import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'

import { ImprovementSelect } from '../src/components'

storiesOf('ImprovementSelect', module).add('view', () => <ImprovementSelect value={1} onChange={action('onChange')} />)
