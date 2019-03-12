import React, { useRef, useCallback, useState } from 'react'
import { observer } from 'mobx-react-lite'
import ReactMde from 'react-mde'
import classNames from 'classnames'
import Showdown from 'showdown'
import 'react-mde/lib/styles/css/react-mde-all.css'

import TextField from '@material-ui/core/TextField'

import { ObservableOperation } from '../../stores'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
  root: {
    margin: 8,
    marginTop: 8 * 3
  },
  mde: {
    color: 'white'
  }
})

const converter = new Showdown.Converter({
  omitExtraWLInCodeBlocks: true,
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true
})

interface OperationDescriptionFieldProps {
  operation: ObservableOperation
}

const OperationDescriptionField: React.FC<OperationDescriptionFieldProps> = ({ operation }) => {
  const { description } = operation
  const classes = useStyles()
  const [tab, setTab] = useState<'write' | 'preview'>('preview')
  const handleChange = useCallback(
    (value: string) => {
      operation.description = value
    },
    [operation]
  )

  const generateMarkdownPreview = (markdown: string) =>
    Promise.resolve(converter.makeHtml(markdown.replace(/[ ]*(\r\n|\n|\r)/g, '<br />\n')))

  return (
    <>
      <div className={classNames('container', classes.root)}>
        <ReactMde
          className={classes.mde}
          onTabChange={setTab}
          selectedTab={tab}
          value={description}
          onChange={handleChange}
          generateMarkdownPreview={generateMarkdownPreview}
        />
      </div>
    </>
  )
}

export default observer(OperationDescriptionField)
