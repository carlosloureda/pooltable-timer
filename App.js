import React from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity,
  TouchableHighlight, Button, TextInput
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import TimerView from './components/TimerView';
import PlayerList from './components/PlayerList';
import BlzTextInput from './components/ui/BlzTextInput';

export default class App extends React.Component {

  state = {
    addPlayerVisible: false,
    players: []
  };

  toggleAddPlayerForm() {
    this.setState({addPlayerVisible: ! this.state.addPlayerVisible});
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>

        </View>
        <View style={styles.mainTimer}>
          <TimerView />
          <View style={styles.extraButtons}>
            <TouchableOpacity onPress={() => { this.toggleAddPlayerForm()}} >
                <MaterialIcons name="person-add" size={40}/>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.players}>
          { this.state.addPlayerVisible &&
            <View style={styles.playerAdd}>
              <View style={styles.playerAddName}>
                <BlzTextInput />
              </View>
              <TouchableOpacity
                style={styles.playerAddBtn}
                title="add" onPress={() => { this.toggleAddPlayerForm()}}
              >
                <FontAwesome name="save" size={40} />
              </TouchableOpacity>
            </View>
          }
          <PlayerList timer={this.state.players}/>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
    backgroundColor: 'grey',
  },
  header: {
    backgroundColor: 'grey',
    height: 5
  },
  mainTimer: {
    backgroundColor: 'blue',
    height: 100,
    flexDirection: 'row'
  },
  players: {
    backgroundColor: 'yellow',
    flex: 1,
    marginTop: 5
  },
  extraButtons: {
    // backgroundColor: 'red',
    flex:1,
    alignItems: 'center',
    justifyContent: 'space-around'
    // width: 200,
    // height: 200
  },
  playerAdd: {
    backgroundColor: 'white',
    height: 100,
    flexDirection: 'row',
    borderBottomWidth: 5,
    borderTopWidth: 5,
    borderColor: '#E5E5E5',
  },
  playerAddName: {
    // backgroundColor: 'red',
    flex: 4

  },
  playerAddBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'

  }

});
