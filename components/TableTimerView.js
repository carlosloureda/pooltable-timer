import React from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity,
  TouchableHighlight, Button, TextInput, Image
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import TimerView from './TimerView';
import PlayerList from './PlayerList';
import Header from './Header';
import BlzTextInput from './ui/BlzTextInput';

import { connect } from 'react-redux'
import { addNewPlayer, playerStartTimer, foo } from '../actions/index'
import { Utils } from '../utils/utils';

class TableTimerView extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      header: <Header
                navigation={navigation}
              />
    }
  };

  constructor(props) {
    super(props)
    this.onPlayerNameChange = this.onPlayerNameChange.bind(this);
  }

  state = {
    addPlayerVisible: false,
    playerName: null,
    language: 'js'
  };

  toggleAddPlayerForm() {
    this.setState({addPlayerVisible: ! this.state.addPlayerVisible});
  }

  onAddPlayer() {
    const id = Utils.uid();
    this.props.addNewPlayer(this.state.playerName, id);
    //TODO:  Add remaining time to remaining players
    if (this.props.timer.status === Utils.TIMER_STARTED) {
      this.props.playerStartTimer(id, new Date().getTime())
    }
    this.setState({
      addPlayerVisible: ! this.state.addPlayerVisible,
      playerName: null
    });
  }

  onPlayerNameChange(text) {
    this.setState({
      ...this.state,
      playerName: text
    })
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <View style={styles.mainTimer}>
          <TimerView />
          <View style={styles.extraButtons}>
            <TouchableOpacity onPress={() => { this.toggleAddPlayerForm()}} >
                <MaterialIcons name="person-add" color="#eae052" size={40}/>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.players}>
          { this.state.addPlayerVisible &&
            <View style={styles.playerAdd}>
              <View style={styles.playerAddName}>
                <BlzTextInput
                  placeholder={'Nombre'}
                  label={'Nombre'}
                  text={this.state.playerName}
                  onChange={this.onPlayerNameChange}
                />
              </View>
              <TouchableOpacity
                style={styles.playerAddBtn}
                title="add" onPress={() => { this.onAddPlayer()}}
              >
                <FontAwesome name="save" size={40} />
              </TouchableOpacity>
            </View>
          }
          <PlayerList />
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    players: state.players,
    timer: state.timer
  };
}

function mapDispatchToProps (dispatch) {
  return {
      addNewPlayer: (name, id) => dispatch(addNewPlayer(name, id)),
      playerStartTimer: (id, time) => dispatch(playerStartTimer(id, time)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TableTimerView)

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  mainTimer: {
    backgroundColor: '#333333',
    height: 100,
    flexDirection: 'row'
  },
  players: {
    backgroundColor: 'yellow',
    flex: 1,
    marginTop: 5
  },
  extraButtons: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'space-around'
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
    flex: 4

  },
  playerAddBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
