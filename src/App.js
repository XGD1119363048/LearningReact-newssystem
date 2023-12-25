import IndexRouter from "./router/IndexRouter"
import { Provider } from 'react-redux'
import store from "./redux/store"

// css
import './App.css'
function App() {
  return <Provider store={store}>
    <IndexRouter></IndexRouter>
  </Provider>
}

export default App