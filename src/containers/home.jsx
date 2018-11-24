import React from 'react'
import { connect } from 'react-redux'
import Paper from '@material-ui/core/Paper'

const Home = props => {
  console.log(props)
  return <Paper>\u4eca\u671d\u306f</Paper>
}

export default connect(state => state)(Home)
