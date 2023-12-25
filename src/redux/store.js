import { combineReducers } from 'redux'
import { createStore } from 'redux'
import { CollapsedReducer } from './reducers/CollapsedReducer'
import { LoadingReducer } from './reducers/LoadingReducer'

const reducer = combineReducers({
  CollapsedReducer,
  LoadingReducer
})

const store = createStore(reducer)

export default store