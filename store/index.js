import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1';
// remote debubgging
import devToolsEnhancer from 'remote-redux-devtools';
import rootReducer from '../reducers'; // the value from combineReducers

const persistConfig = {
    key: 'root',
    storage: storage,
    stateReconciler: autoMergeLevel1 // see "Merge Process" section for details.
};

const pReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(pReducer, devToolsEnhancer());
export const persistor = persistStore(store);