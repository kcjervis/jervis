import React from 'react'
import ReactDOM from 'react-dom'

import flatMap from 'lodash/flatMap'
import App from './App'
import './index.css'
// import registerServiceWorker from './registerServiceWorker'
// registerServiceWorker()

if (!Array.prototype.flatMap) {
  Array.prototype.flatMap = function(callback, self) {
    return flatMap(this, callback) as any
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
