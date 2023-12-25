import { combineReducers } from 'redux'
import { createStore } from 'redux'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { CollapsedReducer } from './reducers/CollapsedReducer'
import { LoadingReducer } from './reducers/LoadingReducer'

const persistConfig = {
  key: 'xgd',
  storage,
  whitelist: ['CollapsedReducer']
}

const reducer = combineReducers({
  CollapsedReducer,
  LoadingReducer
})

const persistedReducer = persistReducer(persistConfig, reducer)

const store = createStore(persistedReducer)
let persistor = persistStore(store)

export {store, persistor}