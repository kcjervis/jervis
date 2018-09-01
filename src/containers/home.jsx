import React from 'react'
import { connect } from 'react-redux'
import Paper from '@material-ui/core/Paper'

const Home = props => {
  return <Paper>ほーむ</Paper>
}

export default connect(state => state)(Home)
