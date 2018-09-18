import './main.scss'

// @ts-ignore
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import WebFontLoader from 'webfontloader'

import { store } from '@client/redux/store'
import RootComponent from '@pages/RootComponent'

WebFontLoader.load({
  google: {
    families: ['Montserrat:300,400,500,700', 'Material Icons'],
  },
})

ReactDOM.render(
  <Provider store={store}>
    <RootComponent />
  </Provider>,
  document.getElementById('root')
)
