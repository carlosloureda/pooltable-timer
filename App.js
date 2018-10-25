import React from 'react';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { persistor, store } from './store';
import { createStackNavigator } from 'react-navigation';

import LoadingView from './components/ui/LoadingView';
import TableTimerView from './components/TableTimerView';
import SettingsView from './components/SettingsView';

import { StyleSheet, View } from 'react-native';

import './config/ReactotronConfig.js';


const Stack = createStackNavigator({
  Home: { screen: TableTimerView },
  Settings: { screen: SettingsView },
});

export default class App extends React.Component {

  resetLocalStorage () {
    persistor.purge();
  }
  render() {
    this.resetLocalStorage()
    return (
      <Provider store={store}>
        {/* the loading and persistor props are both required! */}
        <PersistGate loading={<LoadingView />} persistor={persistor}>

        <View style={styles.container}>
          <Stack />
        </View>
        </PersistGate>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: 24,
    backgroundColor: 'grey',
  }
});
