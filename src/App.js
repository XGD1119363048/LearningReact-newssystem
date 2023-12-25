import IndexRouter from "./router/IndexRouter"
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from "./redux/store"

// css
import './App.css'
function App() {
  return <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <IndexRouter></IndexRouter>
    </PersistGate>
  </Provider>
}

export default App