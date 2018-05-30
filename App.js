import React from 'react';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { persistor, store } from './store';

import LoadingView from './components/ui/LoadingView';
import TableTimerView from './components/TableTimerView';

import './config/ReactotronConfig.js';

export default class App extends React.Component {

  resetLocalStorage () {
    persistor.purge();
  }
  render() {
    // this.resetLocalStorage()
    return (
      <Provider store={store}>
        {/* the loading and persistor props are both required! */}
        <PersistGate loading={<LoadingView />} persistor={persistor}>
          <TableTimerView />
        </PersistGate>
      </Provider>
    );
  }
}
