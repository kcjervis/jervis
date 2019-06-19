import React from 'react'

import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import teal from '@material-ui/core/colors/teal'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Transform from '@material-ui/icons/Transform'

const useStyles = makeStyles({
  button: {
    margin: 8,
    width: 400,
    color: teal[300]
  }
})

const AppsPage: React.FC = props => {
  const classes = useStyles()
  return (
    <>
      <Button className={classes.button} size="large" variant="outlined" href={`#/url-shortener`}>
        <Transform />
        Url Shortener
      </Button>
    </>
  )
}

export default AppsPage
